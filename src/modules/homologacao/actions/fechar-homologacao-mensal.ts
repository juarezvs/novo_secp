"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/shared/lib/prisma";

export async function fecharHomologacaoMensal(homologacaoId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Usuário não autenticado.");
  }

  const itensPendentes = await prisma.homologacaoMensalServidor.count({
    where: {
      homologacaoId,
      possuiPendencia: true,
    },
  });

  if (itensPendentes > 0) {
    throw new Error("Não é possível homologar com pendências.");
  }

  const homologacao = await prisma.homologacaoMensal.update({
    where: {
      id: homologacaoId,
    },
    data: {
      status: "HOMOLOGADA",
      homologadorId: session.user.id,
      homologadaEm: new Date(),
    },
  });

  await prisma.auditoria.create({
    data: {
      usuarioId: session.user.id,
      tipoEvento: "HOMOLOGATE",
      entidade: "HomologacaoMensal",
      entidadeId: homologacao.id,
      descricao: "Homologação mensal fechada pela chefia.",
      payloadDepois: homologacao,
      perfilAtivo: session.user.activeProfileId,
    },
  });

  revalidatePath("/homologacao");
}
