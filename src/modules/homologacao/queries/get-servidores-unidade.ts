import { prisma } from "@/shared/lib/prisma";

export async function getServidoresUnidade(unidadeId: string) {
  return prisma.servidor.findMany({
    where: {
      ativo: true,
      lotacoes: {
        some: {
          unidadeId,
          ativa: true,
        },
      },
    },
    orderBy: {
      nomeFuncional: "asc",
    },
    include: {
      espelhosMensais: true,
      espelhosDiarios: true,
    },
  });
}
