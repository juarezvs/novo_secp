import type { Jornada, MarcacaoPonto } from "@prisma-generated/client";
import { TipoMarcacao } from "@prisma-generated/client";
import { diferencaEmMinutos } from "@/shared/utils/time";

type CalcularEspelhoDiarioInput = {
  jornada: Jornada;
  marcacoes: MarcacaoPonto[];
};

export type ResultadoEspelhoDiario = {
  jornadaPrevistaMinutos: number;
  jornadaRealizadaMinutos: number;
  intervaloMinutos: number;
  creditoMinutos: number;
  debitoMinutos: number;
  horasNaoAutorizadasMinutos: number;
  horasAcimaLimiteMinutos: number;
  possuiInconsistencia: boolean;
  inconsistencias: string[];
};

export function calcularEspelhoDiario({
  jornada,
  marcacoes,
}: CalcularEspelhoDiarioInput): ResultadoEspelhoDiario {
  const inconsistencias: string[] = [];

  const marcacoesValidas = marcacoes
    .filter((m) => m.status !== "INVALIDADA")
    .sort((a, b) => a.dataHora.getTime() - b.dataHora.getTime());

  const entrada = marcacoesValidas.find((m) => m.tipo === TipoMarcacao.ENTRADA);
  const saidaIntervalo = marcacoesValidas.find(
    (m) => m.tipo === TipoMarcacao.SAIDA_INTERVALO,
  );
  const retornoIntervalo = marcacoesValidas.find(
    (m) => m.tipo === TipoMarcacao.RETORNO_INTERVALO,
  );
  const saida = [...marcacoesValidas]
    .reverse()
    .find((m) => m.tipo === TipoMarcacao.SAIDA);

  if (!entrada) inconsistencias.push("Marcação de entrada ausente.");
  if (!saida) inconsistencias.push("Marcação de saída ausente.");

  let intervaloMinutos = 0;

  if (jornada.exigeIntervalo) {
    if (!saidaIntervalo || !retornoIntervalo) {
      inconsistencias.push("Intervalo obrigatório não registrado.");
    }

    if (saidaIntervalo && retornoIntervalo) {
      intervaloMinutos = diferencaEmMinutos(
        saidaIntervalo.dataHora,
        retornoIntervalo.dataHora,
      );

      if (
        jornada.intervaloMinMinutos &&
        intervaloMinutos < jornada.intervaloMinMinutos
      ) {
        inconsistencias.push("Intervalo inferior ao mínimo permitido.");
      }

      if (
        jornada.intervaloMaxMinutos &&
        intervaloMinutos > jornada.intervaloMaxMinutos
      ) {
        inconsistencias.push("Intervalo superior ao máximo permitido.");
      }
    }
  }

  let jornadaRealizadaMinutos = 0;

  if (entrada && saida) {
    const permanenciaTotal = diferencaEmMinutos(
      entrada.dataHora,
      saida.dataHora,
    );
    jornadaRealizadaMinutos = Math.max(0, permanenciaTotal - intervaloMinutos);
  }

  const diferenca = jornadaRealizadaMinutos - jornada.cargaMinutosDia;

  const creditoMinutos = Math.max(0, diferenca);
  const debitoMinutos = Math.max(0, -diferenca);

  return {
    jornadaPrevistaMinutos: jornada.cargaMinutosDia,
    jornadaRealizadaMinutos,
    intervaloMinutos,
    creditoMinutos,
    debitoMinutos,
    horasNaoAutorizadasMinutos: 0,
    horasAcimaLimiteMinutos: 0,
    possuiInconsistencia: inconsistencias.length > 0,
    inconsistencias,
  };
}
