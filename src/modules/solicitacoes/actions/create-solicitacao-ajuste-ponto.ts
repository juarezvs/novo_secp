"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/shared/lib/prisma";
import { getServidorByUserId } from "@/modules/servidores/queries/get-servidor-by-user";
import { createSolicitacaoAjustePontoSchema } from "@/shared/validators/solicitacao.schema";
import { formDataToObject } from "@/shared/validators/form-data";

import type { ActionState } from "@/shared/actions/action-state";
import { actionFailure, actionSuccess } from "@/shared/actions/action-response";

export async function createSolicitacaoAjustePonto(
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
      throw new Error("Servidor não encontrado.");
    }
    const { data, hora, tipoMarcacao, justificativa } =
      createSolicitacaoAjustePontoSchema.parse(formDataToObject(formData));

    const dataHora = new Date(`${data}T${hora}:00`);

    const solicitacao = await prisma.solicitacao.create({
      data: {
        tipo: "AJUSTE_PONTO",
        status: "ENVIADA",
        servidorId: servidor.id,
        solicitanteId: session.user.id,
        dataReferencia: new Date(`${data}T00:00:00`),
        inicioEm: dataHora,
        justificativa,
        respostaFinal: null,
      },
    });

    await prisma.auditoria.create({
      data: {
        usuarioId: session.user.id,
        tipoEvento: "CREATE",
        entidade: "Solicitacao",
        entidadeId: solicitacao.id,
        descricao: "Solicitação de ajuste de ponto criada.",
        payloadDepois: {
          solicitacaoId: solicitacao.id,
          tipoMarcacao,
          dataHora,
          justificativa,
        },
        perfilAtivo: session.user.activeProfileId,
      },
    });

    revalidatePath("/solicitacoes");

    return actionSuccess("Solicitação enviada com sucesso.");
  } catch (error) {
    return actionFailure(error);
  }
}
