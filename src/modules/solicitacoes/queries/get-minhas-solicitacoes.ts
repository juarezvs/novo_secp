import { prisma } from "@/shared/lib/prisma";

export async function getMinhasSolicitacoes(servidorId: string) {
  return prisma.solicitacao.findMany({
    where: {
      servidorId,
    },
    orderBy: {
      criadaEm: "desc",
    },
    include: {
      decisoes: {
        include: {
          usuario: true,
        },
        orderBy: {
          decididaEm: "desc",
        },
      },
    },
  });
}
