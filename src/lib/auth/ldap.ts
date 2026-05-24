import ldap from "ldapjs";

type ValidateLdapCredentialsInput = {
  username: string;
  password: string;
};

type LdapUser = {
  username: string;
  name: string;
  email?: string;
  groups: string[];
};

type LdapAttribute = {
  type: string;
  values?: unknown[];
};

type LdapSearchEntryLike = {
  attributes?: LdapAttribute[];
  pojo?: {
    attributes?: LdapAttribute[];
  };
};

function getLdapAttributeValues(
  entry: ldap.SearchEntry,
  attributeName: string,
): string[] {
  const entryLike = entry as unknown as LdapSearchEntryLike;

  const attributes = entryLike.attributes ?? entryLike.pojo?.attributes ?? [];

  const attribute = attributes.find(
    (item) => item.type.toLowerCase() === attributeName.toLowerCase(),
  );

  if (!attribute?.values) {
    return [];
  }

  return attribute.values
    .filter((value) => value !== null && value !== undefined)
    .map(String);
}

function getFirstLdapAttributeValue(
  entry: ldap.SearchEntry,
  attributeName: string,
): string | undefined {
  return getLdapAttributeValues(entry, attributeName)[0];
}

function escapeLdapFilter(value: string): string {
  return value.replace(/[\\*()[\]\0]/g, (char) => {
    switch (char) {
      case "\\":
        return "\\5c";
      case "*":
        return "\\2a";
      case "(":
        return "\\28";
      case ")":
        return "\\29";
      case "\0":
        return "\\00";
      default:
        return char;
    }
  });
}

export async function validateLdapCredentials({
  username,
  password,
}: ValidateLdapCredentialsInput): Promise<LdapUser | null> {
  const ldapUrl = process.env.LDAP_URL;
  const ldapDomain = process.env.LDAP_DOMAIN;
  const baseDn = process.env.LDAP_BASE_DN;

  if (!ldapUrl || !ldapDomain || !baseDn) {
    throw new Error("Configuração LDAP incompleta.");
  }

  if (!username || !password) {
    return null;
  }

  const client = ldap.createClient({
    url: ldapUrl,
    timeout: 5000,
    connectTimeout: 5000,
  });

  const bindDn = `${ldapDomain}\\${username}`;

  try {
    await new Promise<void>((resolve, reject) => {
      client.bind(bindDn, password, (error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });

    const result = await new Promise<LdapUser | null>((resolve, reject) => {
      const safeUsername = escapeLdapFilter(username);

      const options: ldap.SearchOptions = {
        scope: "sub",
        filter: `(sAMAccountName=${safeUsername})`,
        attributes: ["displayName", "mail", "memberOf", "sAMAccountName"],
      };

      client.search(baseDn, options, (error, response) => {
        if (error) {
          reject(error);
          return;
        }

        let user: LdapUser | null = null;

        response.on("searchEntry", (entry) => {
          const displayName = getFirstLdapAttributeValue(entry, "displayName");
          const mail = getFirstLdapAttributeValue(entry, "mail");
          const sAMAccountName =
            getFirstLdapAttributeValue(entry, "sAMAccountName") ?? username;

          const groups = getLdapAttributeValues(entry, "memberOf");

          user = {
            username: sAMAccountName,
            name: displayName ?? username,
            email: mail,
            groups,
          };
        });

        response.on("error", reject);

        response.on("end", () => {
          resolve(user);
        });
      });
    });

    return result;
  } catch (error) {
    console.error("Erro na autenticação LDAP:", error);
    return null;
  } finally {
    client.unbind();
  }
}
