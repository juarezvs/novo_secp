"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/shared/lib/prisma";
import { getServidorByUserId } from "@/modules/servidores/queries/get-servidor-by-user";
import { TipoMarcacao } from "@prisma-generated/client";

export async function createSolicitacaoAjustePonto(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Usuário não autenticado.");
  }

  const servidor = await getServidorByUserId(session.user.id);

  if (!servidor) {
    throw new Error("Servidor não encontrado.");
  }

  const data = String(formData.get("data") ?? "");
  const hora = String(formData.get("hora") ?? "");
  const tipoMarcacao = String(
    formData.get("tipoMarcacao") ?? "",
  ) as TipoMarcacao;
  const justificativa = String(formData.get("justificativa") ?? "").trim();

  if (!data || !hora || !tipoMarcacao || !justificativa) {
    throw new Error("Preencha data, hora, tipo de marcação e justificativa.");
  }

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
}
