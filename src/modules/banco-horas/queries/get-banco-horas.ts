import { prisma } from "@/shared/lib/prisma";

export async function getBancoHoras(
  servidorId: string,
  ano: number,
  mes: number,
) {
  return prisma.bancoHoras.findUnique({
    where: {
      servidorId_ano_mes: {
        servidorId,
        ano,
        mes,
      },
    },
    include: {
      movimentos: {
        orderBy: {
          criadoEm: "desc",
        },
      },
    },
  });
}
