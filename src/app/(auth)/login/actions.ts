"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export type LoginState = {
  error?: string;
};

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!username || !password) {
    return {
      error: "Informe usuário e senha.",
    };
  }

  try {
    await signIn("credentials", {
      username,
      password,
      redirectTo: "/dashboard",
    });

    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return {
          error: "Usuário ou senha inválidos.",
        };
      }

      if (error.type === "CallbackRouteError") {
        return {
          error:
            "Não foi possível concluir o login. Verifique a configuração LDAP do SECP.",
        };
      }

      return {
        error: "Erro de autenticação.",
      };
    }

    throw error;
  }
}