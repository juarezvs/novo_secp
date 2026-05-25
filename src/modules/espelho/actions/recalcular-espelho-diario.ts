"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/shared/lib/prisma";
import { auth } from "@/auth";
import { fimDoDia, inicioDoDia } from "@/shared/utils/time";
import { calcularEspelhoDiario } from "../services/calcular-espelho-diario";
import { recalcularBancoHorasMensal } from "@/modules/banco-horas/actions/recalcular-banco-horas";

export async function recalcularEspelhoDiario(servidorId: string, data: Date) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Usuário não autenticado.");
  }

  const servidor = await prisma.servidor.findUnique({
    where: { id: servidorId },
    include: {
      jornadas: {
        where: { ativa: true },
        include: { jornada: true },
        take: 1,
      },
    },
  });

  if (!servidor) {
    throw new Error("Servidor não encontrado.");
  }

  const jornada = servidor.jornadas[0]?.jornada;

  if (!jornada) {
    throw new Error("Servidor sem jornada ativa.");
  }

  const dataReferencia = inicioDoDia(data);

  const marcacoes = await prisma.marcacaoPonto.findMany({
    where: {
      servidorId,
      dataHora: {
        gte: inicioDoDia(data),
        lte: fimDoDia(data),
      },
    },
    orderBy: { dataHora: "asc" },
  });

  const resultado = calcularEspelhoDiario({
    jornada,
    marcacoes,
  });

  const espelho = await prisma.espelhoDiario.upsert({
    where: {
      servidorId_dataReferencia: {
        servidorId,
        dataReferencia,
      },
    },
    update: {
      jornadaPrevistaMinutos: resultado.jornadaPrevistaMinutos,
      jornadaRealizadaMinutos: resultado.jornadaRealizadaMinutos,
      intervaloMinutos: resultado.intervaloMinutos,
      creditoMinutos: resultado.creditoMinutos,
      debitoMinutos: resultado.debitoMinutos,
      horasNaoAutorizadasMinutos: resultado.horasNaoAutorizadasMinutos,
      horasAcimaLimiteMinutos: resultado.horasAcimaLimiteMinutos,
      possuiInconsistencia: resultado.possuiInconsistencia,
      recalculadoEm: new Date(),
    },
    create: {
      servidorId,
      dataReferencia,
      jornadaPrevistaMinutos: resultado.jornadaPrevistaMinutos,
      jornadaRealizadaMinutos: resultado.jornadaRealizadaMinutos,
      intervaloMinutos: resultado.intervaloMinutos,
      creditoMinutos: resultado.creditoMinutos,
      debitoMinutos: resultado.debitoMinutos,
      horasNaoAutorizadasMinutos: resultado.horasNaoAutorizadasMinutos,
      horasAcimaLimiteMinutos: resultado.horasAcimaLimiteMinutos,
      possuiInconsistencia: resultado.possuiInconsistencia,
      recalculadoEm: new Date(),
    },
  });

  await prisma.auditoria.create({
    data: {
      usuarioId: session.user.id,
      tipoEvento: "RECALCULATE",
      entidade: "EspelhoDiario",
      entidadeId: espelho.id,
      descricao: "Recalculo do espelho diário.",
      payloadDepois: {
        servidorId,
        dataReferencia,
        resultado,
      },
      perfilAtivo: session.user.activeProfileId,
    },
  });

  await recalcularBancoHorasMensal(
    servidorId,
    dataReferencia.getFullYear(),
    dataReferencia.getMonth() + 1,
  );

  revalidatePath("/espelho");
  revalidatePath("/ponto");

  return espelho;
}
