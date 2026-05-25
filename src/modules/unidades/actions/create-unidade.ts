"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/shared/lib/prisma";
import { requirePermission } from "@/lib/auth/permissions";
import { createUnidadeSchema } from "@/shared/validators/unidade.schema";
import { formDataToObject } from "@/shared/validators/form-data";
import { actionFailure, actionSuccess } from "@/shared/actions/action-response";
import type { ActionState } from "@/shared/actions/action-state";

export async function createUnidade(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    await requirePermission({
      recurso: "unidades",
      acao: "manage",
      escopo: "global",
    });

    const { orgaoId, unidadePaiId, sigla, nome, tipo } =
      createUnidadeSchema.parse(formDataToObject(formData));

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

    return actionSuccess("Unidade cadastrada com sucesso.", unidade);
  } catch (error) {
    return actionFailure(error);
  }
}
