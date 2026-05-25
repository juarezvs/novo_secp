import { prisma } from "@/shared/lib/prisma";

export async function getUnidades() {
  return prisma.unidadeOrganizacional.findMany({
    orderBy: [{ sigla: "asc" }],
    include: {
      orgao: true,
      unidadePai: true,
      _count: {
        select: {
          subunidades: true,
          lotacoes: true,
        },
      },
    },
  });
}
