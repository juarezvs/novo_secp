"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/shared/lib/prisma";

export async function enviarBoletimSecap(boletimId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Usuário não autenticado.");
  }

  const boletim = await prisma.boletimFrequencia.update({
    where: { id: boletimId },
    data: {
      status: "ENVIADO_SECAP",
      enviadoEm: new Date(),
    },
  });

  await prisma.auditoria.create({
    data: {
      usuarioId: session.user.id,
      tipoEvento: "EXPORT",
      entidade: "BoletimFrequencia",
      entidadeId: boletim.id,
      descricao: "Boletim de frequência enviado à SECAP/NUCGP.",
      payloadDepois: boletim,
      perfilAtivo: session.user.activeProfileId,
    },
  });

  revalidatePath("/boletim-frequencia");
}
