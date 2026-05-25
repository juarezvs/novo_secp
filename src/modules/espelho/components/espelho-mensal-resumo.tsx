import type { EspelhoDiario } from "@prisma-generated/client";
import { minutosParaHoraTexto } from "@/shared/utils/time";

type Props = {
  espelhos: EspelhoDiario[];
};

export function EspelhoMensalResumo({ espelhos }: Props) {
  const previsto = espelhos.reduce(
    (total, item) => total + item.jornadaPrevistaMinutos,
    0,
  );

  const realizado = espelhos.reduce(
    (total, item) => total + item.jornadaRealizadaMinutos,
    0,
  );

  const credito = espelhos.reduce(
    (total, item) => total + item.creditoMinutos,
    0,
  );

  const debito = espelhos.reduce(
    (total, item) => total + item.debitoMinutos,
    0,
  );

  const pendencias = espelhos.filter(
    (item) => item.possuiInconsistencia,
  ).length;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-500">Previsto</p>
        <h3 className="mt-2 text-xl font-semibold">
          {minutosParaHoraTexto(previsto)}
        </h3>
      </div>

      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-500">Realizado</p>
        <h3 className="mt-2 text-xl font-semibold">
          {minutosParaHoraTexto(realizado)}
        </h3>
      </div>

      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-500">Crédito</p>
        <h3 className="mt-2 text-xl font-semibold">
          {minutosParaHoraTexto(credito)}
        </h3>
      </div>

      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-500">Débito</p>
        <h3 className="mt-2 text-xl font-semibold">
          {minutosParaHoraTexto(debito)}
        </h3>
      </div>

      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-500">Pendências</p>
        <h3 className="mt-2 text-xl font-semibold">{pendencias}</h3>
      </div>
    </div>
  );
}
