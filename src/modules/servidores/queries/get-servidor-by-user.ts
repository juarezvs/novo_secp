import { prisma } from "@/shared/lib/prisma";

export async function getServidorByUserId(usuarioId: string) {
  return prisma.servidor.findUnique({
    where: {
      usuarioId,
    },
    include: {
      lotacoes: {
        where: { ativa: true },
        include: { unidade: true },
      },
      jornadas: {
        where: { ativa: true },
        include: { jornada: true },
      },
    },
  });
}
