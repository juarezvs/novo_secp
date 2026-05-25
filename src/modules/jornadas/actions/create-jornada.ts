"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/shared/lib/prisma";
import { requirePermission } from "@/lib/auth/permissions";
import type { ActionState } from "@/shared/actions/action-state";
import { actionFailure, actionSuccess } from "@/shared/actions/action-response";
import { createJornadaSchema } from "@/shared/validators/jornada.schema";
import { formDataToObject } from "@/shared/validators/form-data";

export async function createJornada(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    await requirePermission({
      recurso: "jornadas",
      acao: "manage",
      escopo: "global",
    });

    const {
      nome,
      tipo,
      cargaHoras,
      exigeIntervalo,
      intervaloMin,
      intervaloMax,
      horarioInicioPadrao,
      horarioFimPadrao,
    } = createJornadaSchema.parse(formDataToObject(formData));

    const jornada = await prisma.jornada.upsert({
      where: { nome },
      update: {
        tipo,
        cargaMinutosDia: cargaHoras * 60,
        exigeIntervalo,
        intervaloMinMinutos: exigeIntervalo ? intervaloMin : null,
        intervaloMaxMinutos: exigeIntervalo ? intervaloMax : null,
        horarioInicioPadrao: horarioInicioPadrao || null,
        horarioFimPadrao: horarioFimPadrao || null,
        ativa: true,
      },
      create: {
        nome,
        tipo,
        cargaMinutosDia: cargaHoras * 60,
        exigeIntervalo,
        intervaloMinMinutos: exigeIntervalo ? intervaloMin : null,
        intervaloMaxMinutos: exigeIntervalo ? intervaloMax : null,
        horarioInicioPadrao: horarioInicioPadrao || null,
        horarioFimPadrao: horarioFimPadrao || null,
        ativa: true,
      },
    });

    await prisma.auditoria.create({
      data: {
        tipoEvento: "CREATE",
        entidade: "Jornada",
        entidadeId: jornada.id,
        descricao: `Jornada ${nome} criada/atualizada.`,
        payloadDepois: jornada,
      },
    });

    revalidatePath("/jornadas");

    return actionSuccess("Jornada cadastrada com sucesso.");
  } catch (error) {
    return actionFailure(error);
  }
}
