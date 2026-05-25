"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/shared/lib/prisma";
import { requirePermission } from "@/lib/auth/permissions";
import type { ActionState } from "@/shared/actions/action-state";
import { actionFailure, actionSuccess } from "@/shared/actions/action-response";
import { createEquipamentoSchema } from "@/shared/validators/equipamento.schema";
import { formDataToObject } from "@/shared/validators/form-data";

export async function createEquipamento(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("Usuário não autenticado.");
    }

    await requirePermission({
      recurso: "equipamentos",
      acao: "manage",
      escopo: "global",
    });

    const { unidadeId, nome, codigo, localizacao, ip } =
      createEquipamentoSchema.parse(formDataToObject(formData));

    const equipamento = await prisma.equipamentoPonto.upsert({
      where: { codigo },
      update: {
        unidadeId,
        nome,
        localizacao,
        ip,
        ativo: true,
      },
      create: {
        unidadeId,
        nome,
        codigo,
        localizacao,
        ip,
        ativo: true,
      },
    });

    await prisma.auditoria.create({
      data: {
        usuarioId: session.user.id,
        tipoEvento: "CREATE",
        entidade: "EquipamentoPonto",
        entidadeId: equipamento.id,
        descricao: `Equipamento biométrico ${codigo} criado/atualizado.`,
        payloadDepois: equipamento,
        perfilAtivo: session.user.activeProfileId,
      },
    });

    revalidatePath("/biometria/equipamentos");

    return actionSuccess("Equipamento cadastrado com sucesso.");
  } catch (error) {
    return actionFailure(error);
  }
}
