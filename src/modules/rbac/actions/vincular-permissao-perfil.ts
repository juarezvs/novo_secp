"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/shared/lib/prisma";
import { auth } from "@/auth";
import { requirePermission } from "@/lib/auth/permissions";

export async function vincularPermissaoPerfil(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Usuário não autenticado.");
  }

  const perfilId = String(formData.get("perfilId") ?? "");
  const permissaoId = String(formData.get("permissaoId") ?? "");

  if (!perfilId || !permissaoId) {
    throw new Error("Informe perfil e permissão.");
  }

  await requirePermission({
    recurso: "perfis",
    acao: "manage",
    escopo: "global",
  });

  const vinculo = await prisma.perfilPermissao.upsert({
    where: {
      perfilId_permissaoId: {
        perfilId,
        permissaoId,
      },
    },
    update: {},
    create: {
      perfilId,
      permissaoId,
    },
  });

  await prisma.auditoria.create({
    data: {
      usuarioId: session.user.id,
      tipoEvento: "UPDATE",
      entidade: "PerfilPermissao",
      entidadeId: vinculo.id,
      descricao: "Permissão vinculada ao perfil.",
      payloadDepois: {
        perfilId,
        permissaoId,
      },
      perfilAtivo: session.user.activeProfileId,
    },
  });

  revalidatePath("/admin/rbac");
}
