"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/shared/lib/prisma";
import { auth } from "@/auth";
import { requirePermission } from "@/lib/auth/permissions";

export async function createPermissao(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Usuário não autenticado.");
  }

  await requirePermission({
    recurso: "permissoes",
    acao: "manage",
    escopo: "global",
  });

  const recurso = String(formData.get("recurso") ?? "")
    .trim()
    .toLowerCase();
  const acao = String(formData.get("acao") ?? "")
    .trim()
    .toLowerCase();
  const escopo = String(formData.get("escopo") ?? "")
    .trim()
    .toLowerCase();
  const descricao = String(formData.get("descricao") ?? "").trim();

  if (!recurso || !acao || !escopo) {
    throw new Error("Informe recurso, ação e escopo.");
  }

  const permissao = await prisma.permissao.upsert({
    where: {
      recurso_acao_escopo: {
        recurso,
        acao,
        escopo,
      },
    },
    update: {
      descricao: descricao || null,
      ativo: true,
    },
    create: {
      recurso,
      acao,
      escopo,
      descricao: descricao || null,
    },
  });

  await prisma.auditoria.create({
    data: {
      usuarioId: session.user.id,
      tipoEvento: "CREATE",
      entidade: "Permissao",
      entidadeId: permissao.id,
      descricao: `Permissão ${recurso}:${acao}:${escopo} criada/atualizada.`,
      payloadDepois: permissao,
      perfilAtivo: session.user.activeProfileId,
    },
  });

  revalidatePath("/admin/rbac");
}
