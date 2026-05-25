"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/shared/lib/prisma";

export async function createUnidade(formData: FormData) {
  const orgaoId = String(formData.get("orgaoId") ?? "");
  const unidadePaiId = String(formData.get("unidadePaiId") ?? "") || null;
  const sigla = String(formData.get("sigla") ?? "")
    .trim()
    .toUpperCase();
  const nome = String(formData.get("nome") ?? "").trim();
  const tipo = String(formData.get("tipo") ?? "")
    .trim()
    .toUpperCase();

  if (!orgaoId || !sigla || !nome || !tipo) {
    throw new Error("Preencha órgão, sigla, nome e tipo.");
  }

  const unidade = await prisma.unidadeOrganizacional.create({
    data: {
      orgaoId,
      unidadePaiId,
      sigla,
      nome,
      tipo,
    },
  });

  await prisma.auditoria.create({
    data: {
      tipoEvento: "CREATE",
      entidade: "UnidadeOrganizacional",
      entidadeId: unidade.id,
      descricao: `Unidade ${sigla} criada.`,
      payloadDepois: unidade,
    },
  });

  revalidatePath("/unidades");
}
