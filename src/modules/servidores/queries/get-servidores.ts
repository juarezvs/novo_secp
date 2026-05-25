import { prisma } from "@/shared/lib/prisma" 

export async function getServidores() {
  return prisma.servidor.findMany({
    orderBy: { nomeFuncional: 'asc' },
    include: {
      usuario: true,
      lotacoes: {
        where: { ativa: true },
        include: { unidade: true },
      },
      jornadas: {
        where: { ativa: true },
        include: { jornada: true },
      },
    },
  })
}