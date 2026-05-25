import { prisma } from "@/shared/lib/prisma";

export async function getActiveProfilePermissions(perfilId: string) {
  const permissoes = await prisma.perfilPermissao.findMany({
    where: {
      perfilId,
      permissao: {
        ativo: true,
      },
    },
    include: {
      permissao: true,
    },
  });

  return permissoes.map(({ permissao }) => ({
    recurso: permissao.recurso,
    acao: permissao.acao,
    escopo: permissao.escopo,
  }));
}
