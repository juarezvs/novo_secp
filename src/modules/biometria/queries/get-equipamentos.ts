import { prisma } from "@/shared/lib/prisma";

export async function getEquipamentos() {
  return prisma.equipamentoPonto.findMany({
    orderBy: { nome: "asc" },
    include: {
      unidade: true,
      _count: {
        select: {
          marcacoes: true,
        },
      },
    },
  });
}
