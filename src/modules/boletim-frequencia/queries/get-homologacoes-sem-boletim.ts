import { prisma } from "@/shared/lib/prisma";

export async function getHomologacoesSemBoletim(params: {
  unidadeId?: string;
  ano?: number;
  mes?: number;
}) {
  return prisma.homologacaoMensal.findMany({
    where: {
      unidadeId: params.unidadeId,
      ano: params.ano,
      mes: params.mes,
      status: "HOMOLOGADA",
      boletim: null,
    },
    orderBy: [{ ano: "desc" }, { mes: "desc" }],
    include: {
      unidade: true,
      homologador: true,
      servidores: {
        include: {
          servidor: true,
        },
      },
    },
  });
}
