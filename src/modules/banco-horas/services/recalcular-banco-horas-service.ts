import { prisma } from '@/shared/lib/prisma'
import { calcularBancoHorasMensal } from './calcular-banco-horas-mensal'

function getMesAnterior(ano: number, mes: number) {
  if (mes === 1) {
    return { ano: ano - 1, mes: 12 }
  }

  return { ano, mes: mes - 1 }
}

type Params = {
  servidorId: string
  ano: number
  mes: number
  usuarioId?: string | null
  perfilAtivo?: string | null
  origem?: string
}

export async function recalcularBancoHorasMensalService({
  servidorId,
  ano,
  mes,
  usuarioId = null,
  perfilAtivo = null,
  origem = 'SYSTEM',
}: Params) {
  const { ano: anoAnterior, mes: mesAnterior } = getMesAnterior(ano, mes)

  const bancoAnterior = await prisma.bancoHoras.findUnique({
    where: {
      servidorId_ano_mes: {
        servidorId,
        ano: anoAnterior,
        mes: mesAnterior,
      },
    },
  })

  const saldoInicial = bancoAnterior?.saldoFinalMinutos ?? 0

  const inicio = new Date(ano, mes - 1, 1)
  const fim = new Date(ano, mes, 0, 23, 59, 59, 999)

  const espelhos = await prisma.espelhoDiario.findMany({
    where: {
      servidorId,
      dataReferencia: {
        gte: inicio,
        lte: fim,
      },
    },
  })

  const resultado = calcularBancoHorasMensal(espelhos, saldoInicial)

  const banco = await prisma.bancoHoras.upsert({
    where: {
      servidorId_ano_mes: {
        servidorId,
        ano,
        mes,
      },
    },
    update: {
      saldoInicialMinutos: saldoInicial,
      creditoMinutos: resultado.creditoDentroLimiteMinutos,
      debitoMinutos: resultado.debitoMinutos,
      saldoFinalMinutos: resultado.saldoFinalMinutos,
    },
    create: {
      servidorId,
      ano,
      mes,
      saldoInicialMinutos: saldoInicial,
      creditoMinutos: resultado.creditoDentroLimiteMinutos,
      debitoMinutos: resultado.debitoMinutos,
      saldoFinalMinutos: resultado.saldoFinalMinutos,
      limiteMensalCreditoMinutos: 960,
    },
  })

  await prisma.auditoria.create({
    data: {
      usuarioId,
      tipoEvento: 'RECALCULATE',
      entidade: 'BancoHoras',
      entidadeId: banco.id,
      descricao: `Recálculo do banco de horas ${mes}/${ano}. Origem: ${origem}.`,
      payloadDepois: {
        servidorId,
        ano,
        mes,
        saldoInicial,
        resultado,
      },
      perfilAtivo,
    },
  })

  return banco
}