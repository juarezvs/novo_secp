"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/shared/lib/prisma";

export async function switchActiveProfile(perfilId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Usuário não autenticado.");
  }

  const usuarioPerfil = await prisma.usuarioPerfil.findFirst({
    where: {
      usuarioId: session.user.id,
      perfilId,
      ativo: true,
    },
  });

  if (!usuarioPerfil) {
    throw new Error("Perfil não pertence ao usuário.");
  }

  await prisma.perfilAtivoUsuario.upsert({
    where: {
      usuarioId: session.user.id,
    },
    update: {
      perfilId,
      unidadeId: usuarioPerfil.unidadeId,
    },
    create: {
      usuarioId: session.user.id,
      perfilId,
      unidadeId: usuarioPerfil.unidadeId,
    },
  });

  await prisma.auditoria.create({
    data: {
      usuarioId: session.user.id,
      tipoEvento: "SWITCH_PROFILE",
      entidade: "PerfilAtivoUsuario",
      entidadeId: perfilId,
      descricao: "Troca de perfil ativo na sessão.",
      payloadDepois: {
        perfilId,
        unidadeId: usuarioPerfil.unidadeId,
      },
    },
  });

  revalidatePath("/dashboard");
}
