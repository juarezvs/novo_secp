"use client";

import { useTransition } from "react";
import { recalcularBancoHorasMensal } from "../actions/recalcular-banco-horas";

type Props = {
  servidorId: string;
  ano: number;
  mes: number;
};

export function RecalcularBancoButton({ servidorId, ano, mes }: Props) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await recalcularBancoHorasMensal(servidorId, ano, mes);
          window.location.reload();
        });
      }}
      className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
    >
      {isPending ? "Recalculando..." : "Recalcular banco"}
    </button>
  );
}
