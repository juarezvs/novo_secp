"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { recalcularEspelhoDiarioService } from "../services/recalcular-espelho-diario-service";
import { recalcularBancoHorasMensalService } from "@/modules/banco-horas/services/recalcular-banco-horas-service";

export async function recalcularEspelhoDiario(servidorId: string, data: Date) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Usuário não autenticado.");
  }

  const espelho = await recalcularEspelhoDiarioService({
    servidorId,
    data,
    usuarioId: session.user.id,
    perfilAtivo: session.user.activeProfileId,
    origem: "ACTION",
  });

  await recalcularBancoHorasMensalService({
    servidorId,
    ano: espelho.dataReferencia.getFullYear(),
    mes: espelho.dataReferencia.getMonth() + 1,
    usuarioId: session.user.id,
    perfilAtivo: session.user.activeProfileId,
    origem: "ACTION_AFTER_ESPELHO",
  });

  revalidatePath("/espelho");
  revalidatePath("/ponto");
  revalidatePath("/banco-horas");

  return espelho;
}
