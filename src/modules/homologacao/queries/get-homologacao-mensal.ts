import { prisma } from "@/shared/lib/prisma";

export async function getHomologacaoMensal(
  unidadeId: string,
  ano: number,
  mes: number,
) {
  return prisma.homologacaoMensal.findUnique({
    where: {
      unidadeId_ano_mes: {
        unidadeId,
        ano,
        mes,
      },
    },
    include: {
      unidade: true,
      homologador: true,
      servidores: {
        include: {
          servidor: true,
        },
        orderBy: {
          servidor: {
            nomeFuncional: "asc",
          },
        },
      },
      boletim: true,
    },
  });
}
