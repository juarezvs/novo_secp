import { prisma } from "@/shared/lib/prisma";

export async function getBoletinsFrequencia(params: {
  unidadeId?: string;
  ano?: number;
  mes?: number;
}) {
  return prisma.boletimFrequencia.findMany({
    where: {
      unidadeId: params.unidadeId,
      ano: params.ano,
      mes: params.mes,
    },
    orderBy: [{ ano: "desc" }, { mes: "desc" }],
    include: {
      unidade: true,
      homologacao: {
        include: {
          homologador: true,
          servidores: {
            include: {
              servidor: true,
            },
          },
        },
      },
    },
  });
}
