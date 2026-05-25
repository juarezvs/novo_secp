"use server";

import { TipoJornada } from "@prisma-generated/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/shared/lib/prisma";

export async function createJornada(formData: FormData) {
  const nome = String(formData.get("nome") ?? "").trim();
  const tipo = String(formData.get("tipo") ?? "") as TipoJornada;
  const cargaHoras = Number(formData.get("cargaHoras") ?? 0);
  const exigeIntervalo = formData.get("exigeIntervalo") === "on";
  const intervaloMin = Number(formData.get("intervaloMin") ?? 0);
  const intervaloMax = Number(formData.get("intervaloMax") ?? 0);
  const horarioInicioPadrao =
    String(formData.get("horarioInicioPadrao") ?? "").trim() || null;
  const horarioFimPadrao =
    String(formData.get("horarioFimPadrao") ?? "").trim() || null;

  if (!nome || !tipo || !cargaHoras) {
    throw new Error("Preencha nome, tipo e carga horária.");
  }

  if (exigeIntervalo && (!intervaloMin || !intervaloMax)) {
    throw new Error("Informe intervalo mínimo e máximo.");
  }

  const jornada = await prisma.jornada.upsert({
    where: { nome },
    update: {
      tipo,
      cargaMinutosDia: cargaHoras * 60,
      exigeIntervalo,
      intervaloMinMinutos: exigeIntervalo ? intervaloMin : null,
      intervaloMaxMinutos: exigeIntervalo ? intervaloMax : null,
      horarioInicioPadrao,
      horarioFimPadrao,
      ativa: true,
    },
    create: {
      nome,
      tipo,
      cargaMinutosDia: cargaHoras * 60,
      exigeIntervalo,
      intervaloMinMinutos: exigeIntervalo ? intervaloMin : null,
      intervaloMaxMinutos: exigeIntervalo ? intervaloMax : null,
      horarioInicioPadrao,
      horarioFimPadrao,
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
}
