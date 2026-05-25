import { ZodError } from "zod";

export function formatActionError(error: unknown) {
  if (error instanceof ZodError) {
    const firstError = error.issues[0]?.message;
    return firstError ?? "Dados inválidos.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Erro inesperado.";
}
