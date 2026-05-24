import { auth } from "@/auth";

export async function getRequiredSession() {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Usuário não autenticado.");
  }

  return session;
}

export async function getActiveProfile() {
  const session = await getRequiredSession();

  const activeProfileId = session.user.activeProfileId;

  if (!activeProfileId) {
    return null;
  }

  return (
    session.user.perfis.find((perfil) => perfil.id === activeProfileId) ?? null
  );
}
