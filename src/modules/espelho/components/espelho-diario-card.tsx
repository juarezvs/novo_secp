import type { EspelhoDiario } from "@prisma-generated/client";
import { minutosParaHoraTexto } from "@/shared/utils/time";

type EspelhoDiarioCardProps = {
  espelho: EspelhoDiario | null;
};

export function EspelhoDiarioCard({ espelho }: EspelhoDiarioCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Espelho diário</h2>

      {!espelho ? (
        <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
          O espelho do dia ainda não foi calculado.
        </p>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs text-slate-500">Jornada prevista</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">
              {minutosParaHoraTexto(espelho.jornadaPrevistaMinutos)}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs text-slate-500">Jornada realizada</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">
              {minutosParaHoraTexto(espelho.jornadaRealizadaMinutos)}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs text-slate-500">Crédito</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">
              {minutosParaHoraTexto(espelho.creditoMinutos)}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs text-slate-500">Débito</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">
              {minutosParaHoraTexto(espelho.debitoMinutos)}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs text-slate-500">Intervalo</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">
              {minutosParaHoraTexto(espelho.intervaloMinutos)}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs text-slate-500">Situação</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">
              {espelho.possuiInconsistencia ? "Com inconsistência" : "Regular"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
