"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/shared/lib/prisma";
import { calcularBancoHorasMensal } from "../services/calcular-banco-horas-mensal";

function getMesAnterior(ano: number, mes: number) {
  if (mes === 1) {
    return { ano: ano - 1, mes: 12 };
  }

  return { ano, mes: mes - 1 };
}

export async function recalcularBancoHorasMensal(
  servidorId: string,
  ano: number,
  mes: number,
) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Usuário não autenticado.");
  }

  const { ano: anoAnterior, mes: mesAnterior } = getMesAnterior(ano, mes);

  const bancoAnterior = await prisma.bancoHoras.findUnique({
    where: {
      servidorId_ano_mes: {
        servidorId,
        ano: anoAnterior,
        mes: mesAnterior,
      },
    },
  });

  const saldoInicial = bancoAnterior?.saldoFinalMinutos ?? 0;

  const inicio = new Date(ano, mes - 1, 1);
  const fim = new Date(ano, mes, 0, 23, 59, 59, 999);

  const espelhos = await prisma.espelhoDiario.findMany({
    where: {
      servidorId,
      dataReferencia: {
        gte: inicio,
        lte: fim,
      },
    },
  });

  const resultado = calcularBancoHorasMensal(espelhos, saldoInicial);

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
  });

  await prisma.movimentoBancoHoras.create({
    data: {
      bancoHorasId: banco.id,
      tipo: "AJUSTE_MANUAL",
      minutos: resultado.saldoFinalMinutos,
      dataReferencia: new Date(),
      descricao: `Recalculo mensal do banco de horas ${mes}/${ano}.`,
    },
  });

  if (resultado.horasAcimaLimiteMinutos > 0) {
    await prisma.movimentoBancoHoras.create({
      data: {
        bancoHorasId: banco.id,
        tipo: "EXPIRACAO",
        minutos: resultado.horasAcimaLimiteMinutos,
        dataReferencia: new Date(),
        descricao:
          "Horas acima do limite ordinário mensal de 16h não incorporadas ao banco.",
      },
    });
  }

  await prisma.auditoria.create({
    data: {
      usuarioId: session.user.id,
      tipoEvento: "RECALCULATE",
      entidade: "BancoHoras",
      entidadeId: banco.id,
      descricao: `Recalculo do banco de horas ${mes}/${ano}.`,
      payloadDepois: {
        servidorId,
        ano,
        mes,
        saldoInicial,
        resultado,
      },
      perfilAtivo: session.user.activeProfileId,
    },
  });

  revalidatePath("/banco-horas");
  revalidatePath("/espelho");

  return banco;
}
