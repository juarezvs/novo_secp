"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/shared/lib/prisma";
import { recalcularEspelhoDiario } from "@/modules/espelho/actions/recalcular-espelho-diario";
import { TipoMarcacao } from "@prisma-generated/client";
import { decidirSolicitacaoSchema } from "@/shared/validators/solicitacao.schema";
import { formDataToObject } from "@/shared/validators/form-data";

export async function decidirSolicitacao(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Usuário não autenticado.");
  }

  const { solicitacaoId, decisao, observacao } = decidirSolicitacaoSchema.parse(
    formDataToObject(formData),
  );

  const aprovada = decisao === "APROVAR";

  if (!solicitacaoId || !decisao) {
    throw new Error("Solicitação ou decisão não informada.");
  }

  await prisma.$transaction(async (tx) => {
    const solicitacao = await tx.solicitacao.findUnique({
      where: { id: solicitacaoId },
      include: {
        servidor: true,
      },
    });

    if (!solicitacao) {
      throw new Error("Solicitação não encontrada.");
    }

    if (!["ENVIADA", "EM_ANALISE"].includes(solicitacao.status)) {
      throw new Error("Solicitação não está pendente de decisão.");
    }

    await tx.decisaoSolicitacao.create({
      data: {
        solicitacaoId,
        usuarioId: session.user.id,
        aprovada,
        observacao: observacao || null,
      },
    });

    await tx.solicitacao.update({
      where: { id: solicitacaoId },
      data: {
        status: aprovada ? "APROVADA" : "INDEFERIDA",
        respostaFinal: observacao || null,
      },
    });

    if (aprovada && solicitacao.tipo === "AJUSTE_PONTO") {
      if (!solicitacao.inicioEm || !solicitacao.dataReferencia) {
        throw new Error("Solicitação de ajuste sem data/hora válida.");
      }

      await tx.marcacaoPonto.create({
        data: {
          servidorId: solicitacao.servidorId,
          tipo: TipoMarcacao.AJUSTADA,
          origem: "MANUAL",
          status: "VALIDA",
          dataHora: solicitacao.inicioEm,
          dataReferencia: solicitacao.dataReferencia,
          justificativa: solicitacao.justificativa,
        },
      });
    }

    await tx.auditoria.create({
      data: {
        usuarioId: session.user.id,
        tipoEvento: aprovada ? "APPROVE" : "REJECT",
        entidade: "Solicitacao",
        entidadeId: solicitacaoId,
        descricao: aprovada
          ? "Solicitação aprovada pela chefia."
          : "Solicitação indeferida pela chefia.",
        payloadDepois: {
          solicitacaoId,
          aprovada,
          observacao,
        },
        perfilAtivo: session.user.activeProfileId,
      },
    });
  });

  const solicitacaoAtualizada = await prisma.solicitacao.findUnique({
    where: { id: solicitacaoId },
  });

  if (
    aprovada &&
    solicitacaoAtualizada?.tipo === "AJUSTE_PONTO" &&
    solicitacaoAtualizada.dataReferencia
  ) {
    await recalcularEspelhoDiario(
      solicitacaoAtualizada.servidorId,
      solicitacaoAtualizada.dataReferencia,
    );
  }

  revalidatePath("/solicitacoes");
  revalidatePath("/chefia/solicitacoes");
  revalidatePath("/espelho");
  revalidatePath("/banco-horas");
}
