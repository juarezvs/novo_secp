import { prisma } from "@/shared/lib/prisma" 

export async function getJornadas() {
  return prisma.jornada.findMany({
    orderBy: { nome: 'asc' },
    include: {
      _count: {
        select: {
          unidades: true,
          servidores: true,
        },
      },
    },
  })
}