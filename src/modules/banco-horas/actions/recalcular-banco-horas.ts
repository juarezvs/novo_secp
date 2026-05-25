"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { recalcularBancoHorasMensalService } from "../services/recalcular-banco-horas-service";

export async function recalcularBancoHorasMensal(
  servidorId: string,
  ano: number,
  mes: number,
) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Usuário não autenticado.");
  }

  const banco = await recalcularBancoHorasMensalService({
    servidorId,
    ano,
    mes,
    usuarioId: session.user.id,
    perfilAtivo: session.user.activeProfileId,
    origem: "ACTION",
  });

  revalidatePath("/banco-horas");
  revalidatePath("/espelho");

  return banco;
}
