import type { EspelhoDiario } from "@prisma-generated/client";

const LIMITE_CREDITO_MENSAL_MINUTOS = 16 * 60;

type ResultadoBancoHorasMensal = {
  creditoMinutos: number;
  creditoDentroLimiteMinutos: number;
  horasAcimaLimiteMinutos: number;
  debitoMinutos: number;
  saldoFinalMinutos: number;
};

export function calcularBancoHorasMensal(
  espelhos: EspelhoDiario[],
  saldoInicialMinutos = 0,
): ResultadoBancoHorasMensal {
  const creditoBruto = espelhos.reduce(
    (total, item) => total + item.creditoMinutos,
    0,
  );

  const debito = espelhos.reduce(
    (total, item) => total + item.debitoMinutos,
    0,
  );

  const creditoDentroLimite = Math.min(
    creditoBruto,
    LIMITE_CREDITO_MENSAL_MINUTOS,
  );

  const horasAcimaLimite = Math.max(
    0,
    creditoBruto - LIMITE_CREDITO_MENSAL_MINUTOS,
  );

  const saldoFinal = saldoInicialMinutos + creditoDentroLimite - debito;

  return {
    creditoMinutos: creditoBruto,
    creditoDentroLimiteMinutos: creditoDentroLimite,
    horasAcimaLimiteMinutos: horasAcimaLimite,
    debitoMinutos: debito,
    saldoFinalMinutos: saldoFinal,
  };
}
