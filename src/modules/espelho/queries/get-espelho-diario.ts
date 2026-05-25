import { prisma } from "@/shared/lib/prisma";
import { inicioDoDia } from "@/shared/utils/time";

export async function getEspelhoDiario(servidorId: string, data = new Date()) {
  return prisma.espelhoDiario.findUnique({
    where: {
      servidorId_dataReferencia: {
        servidorId,
        dataReferencia: inicioDoDia(data),
      },
    },
  });
}
