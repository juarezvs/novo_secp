"use server";

import type { ActionState } from "@/shared/actions/action-state";
import { actionFailure, actionSuccess } from "@/shared/actions/action-response";
import { createMarcacaoSchema } from "@/shared/validators/marcacao.schema";
import { formDataToObject } from "@/shared/validators/form-data";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { getServidorByUserId } from "@/modules/servidores/queries/get-servidor-by-user";
import { prisma } from "@/shared/lib/prisma";
import { OrigemMarcacao } from "@prisma-generated/index";
import { recalcularEspelhoDiario } from "@/modules/espelho/actions/recalcular-espelho-diario";
function inicioDoDia(data: Date) {
  return new Date(data.getFullYear(), data.getMonth(), data.getDate());
}
export async function createMarcacao(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("Usuário não autenticado.");
    }

    const servidor = await getServidorByUserId(session.user.id);

    if (!servidor) {
      throw new Error("Usuário autenticado não possui servidor vinculado.");
    }

    const { tipo, latitude, longitude } = createMarcacaoSchema.parse(
      formDataToObject(formData),
    );

    const agora = new Date();

    const marcacao = await prisma.marcacaoPonto.create({
      data: {
        servidorId: servidor.id,
        tipo,
        origem: OrigemMarcacao.TOTEM,
        status: "VALIDA",
        dataHora: agora,
        dataReferencia: inicioDoDia(agora),
        latitude,
        longitude,
        justificativa: "Registro realizado pelo painel web do SECP.",
      },
    });

    await prisma.auditoria.create({
      data: {
        usuarioId: session.user.id,
        tipoEvento: "CREATE",
        entidade: "MarcacaoPonto",
        entidadeId: marcacao.id,
        descricao: `Registro de ponto realizado: ${tipo}.`,
        payloadDepois: {
          id: marcacao.id,
          tipo,
          dataHora: marcacao.dataHora,
          origem: marcacao.origem,
          servidorId: servidor.id,
        },
        perfilAtivo: session.user.activeProfileId,
      },
    });

    await recalcularEspelhoDiario(servidor.id, agora);

    revalidatePath("/ponto");
    revalidatePath("/espelho");

    return actionSuccess("Ponto registrado com sucesso.");
  } catch (error) {
    return actionFailure(error);
  }
}
