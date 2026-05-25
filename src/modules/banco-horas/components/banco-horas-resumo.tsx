import type { BancoHoras } from "@prisma-generated/client";
import { minutosParaHoraTexto } from "@/shared/utils/time";

type Props = {
  banco: BancoHoras | null;
};

export function BancoHorasResumo({ banco }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-500">Saldo inicial</p>
        <h3 className="mt-2 text-xl font-semibold">
          {minutosParaHoraTexto(banco?.saldoInicialMinutos ?? 0)}
        </h3>
      </div>

      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-500">Crédito no mês</p>
        <h3 className="mt-2 text-xl font-semibold">
          {minutosParaHoraTexto(banco?.creditoMinutos ?? 0)}
        </h3>
      </div>

      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-500">Débito no mês</p>
        <h3 className="mt-2 text-xl font-semibold">
          {minutosParaHoraTexto(banco?.debitoMinutos ?? 0)}
        </h3>
      </div>

      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-500">Saldo final</p>
        <h3 className="mt-2 text-xl font-semibold">
          {minutosParaHoraTexto(banco?.saldoFinalMinutos ?? 0)}
        </h3>
      </div>
    </div>
  );
}
