import { prisma } from "@/shared/lib/prisma";

export async function getEspelhosDoMes(
  servidorId: string,
  ano: number,
  mes: number,
) {
  const inicio = new Date(ano, mes - 1, 1);
  const fim = new Date(ano, mes, 0, 23, 59, 59, 999);

  return prisma.espelhoDiario.findMany({
    where: {
      servidorId,
      dataReferencia: {
        gte: inicio,
        lte: fim,
      },
    },
    orderBy: {
      dataReferencia: "asc",
    },
  });
}
