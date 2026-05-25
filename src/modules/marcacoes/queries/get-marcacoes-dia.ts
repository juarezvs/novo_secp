import { prisma } from "@/shared/lib/prisma";

function inicioDoDia(data: Date) {
  return new Date(data.getFullYear(), data.getMonth(), data.getDate());
}

function fimDoDia(data: Date) {
  return new Date(
    data.getFullYear(),
    data.getMonth(),
    data.getDate(),
    23,
    59,
    59,
    999,
  );
}

export async function getMarcacoesDia(servidorId: string, data = new Date()) {
  return prisma.marcacaoPonto.findMany({
    where: {
      servidorId,
      dataHora: {
        gte: inicioDoDia(data),
        lte: fimDoDia(data),
      },
    },
    orderBy: {
      dataHora: "asc",
    },
  });
}
