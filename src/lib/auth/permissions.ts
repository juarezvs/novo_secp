import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/shared/lib/prisma";

type PermissionInput = {
  recurso: string;
  acao: string;
  escopo: string;
};

export async function getActiveProfileOrRedirect() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (!session.user.activeProfileId) {
    redirect("/dashboard");
  }

  return {
    session,
    activeProfileId: session.user.activeProfileId,
  };
}

export async function hasPermission(input: PermissionInput) {
  const { activeProfileId } = await getActiveProfileOrRedirect();

  const permissao = await prisma.perfilPermissao.findFirst({
    where: {
      perfilId: activeProfileId,
      permissao: {
        recurso: input.recurso,
        acao: input.acao,
        escopo: input.escopo,
        ativo: true,
      },
    },
  });

  return Boolean(permissao);
}

export async function requirePermission(input: PermissionInput) {
  const allowed = await hasPermission(input);

  if (!allowed) {
    redirect("/acesso-negado");
  }
}
