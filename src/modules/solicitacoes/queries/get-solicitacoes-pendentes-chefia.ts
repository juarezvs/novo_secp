import { prisma } from "@/shared/lib/prisma";

export async function getSolicitacoesPendentesChefia(unidadeId: string) {
  return prisma.solicitacao.findMany({
    where: {
      status: {
        in: ["ENVIADA", "EM_ANALISE"],
      },
      servidor: {
        lotacoes: {
          some: {
            unidadeId,
            ativa: true,
          },
        },
      },
    },
    orderBy: {
      criadaEm: "asc",
    },
    include: {
      servidor: {
        include: {
          usuario: true,
          lotacoes: {
            where: { ativa: true },
            include: { unidade: true },
          },
        },
      },
      solicitante: true,
      decisoes: {
        include: {
          usuario: true,
        },
      },
    },
  });
}
