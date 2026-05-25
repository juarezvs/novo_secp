import { prisma } from '@/shared/lib/prisma'

export async function getRbacOverview() {
  const [perfis, permissoes] = await Promise.all([
    prisma.perfil.findMany({
      orderBy: { nome: 'asc' },
      include: {
        permissoes: {
          include: {
            permissao: true,
          },
        },
        _count: {
          select: {
            usuarios: true,
          },
        },
      },
    }),

    prisma.permissao.findMany({
      orderBy: [
        { recurso: 'asc' },
        { acao: 'asc' },
        { escopo: 'asc' },
      ],
    }),
  ])

  return {
    perfis,
    permissoes,
  }
}