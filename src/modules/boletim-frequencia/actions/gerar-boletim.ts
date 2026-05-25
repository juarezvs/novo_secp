"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/shared/lib/prisma";

export async function gerarBoletimFrequencia(homologacaoId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Usuário não autenticado.");
  }

  const homologacao = await prisma.homologacaoMensal.findUnique({
    where: { id: homologacaoId },
  });

  if (!homologacao) {
    throw new Error("Homologação não encontrada.");
  }

  if (homologacao.status !== "HOMOLOGADA") {
    throw new Error("Somente homologações fechadas podem gerar boletim.");
  }

  const boletim = await prisma.boletimFrequencia.upsert({
    where: {
      homologacaoId,
    },
    update: {
      status: "GERADO",
      geradoEm: new Date(),
    },
    create: {
      homologacaoId,
      unidadeId: homologacao.unidadeId,
      ano: homologacao.ano,
      mes: homologacao.mes,
      status: "GERADO",
      geradoEm: new Date(),
    },
  });

  await prisma.auditoria.create({
    data: {
      usuarioId: session.user.id,
      tipoEvento: "CREATE",
      entidade: "BoletimFrequencia",
      entidadeId: boletim.id,
      descricao: "Boletim de frequência gerado.",
      payloadDepois: boletim,
      perfilAtivo: session.user.activeProfileId,
    },
  });

  revalidatePath("/boletim-frequencia");
  revalidatePath("/homologacao");
}
