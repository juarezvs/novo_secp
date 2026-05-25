import { prisma } from "@/shared/lib/prisma";
import { fimDoDia, inicioDoDia } from "@/shared/utils/time";
import { calcularEspelhoDiario } from "./calcular-espelho-diario";

type Params = {
  servidorId: string;
  data: Date;
  usuarioId?: string | null;
  perfilAtivo?: string | null;
  origem?: string;
};

export async function recalcularEspelhoDiarioService({
  servidorId,
  data,
  usuarioId = null,
  perfilAtivo = null,
  origem = "SYSTEM",
}: Params) {
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
    orderBy: {
      dataHora: "asc",
    },
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
      usuarioId,
      tipoEvento: "RECALCULATE",
      entidade: "EspelhoDiario",
      entidadeId: espelho.id,
      descricao: `Recálculo do espelho diário. Origem: ${origem}.`,
      payloadDepois: {
        servidorId,
        dataReferencia,
        resultado,
      },
      perfilAtivo,
    },
  });

  return espelho;
}
