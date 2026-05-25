import type { MovimentoBancoHoras } from "@prisma-generated/client";
import { minutosParaHoraTexto } from "@/shared/utils/time";

type Props = {
  movimentos: MovimentoBancoHoras[];
};

function formatarData(data: Date) {
  return new Intl.DateTimeFormat("pt-BR").format(data);
}

export function MovimentosBancoTable({ movimentos }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="border-b p-5">
        <h2 className="text-lg font-semibold text-slate-900">
          Movimentos do banco de horas
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Horas</th>
              <th className="px-4 py-3">Descrição</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {movimentos.map((movimento) => (
              <tr key={movimento.id}>
                <td className="px-4 py-3">
                  {formatarData(movimento.dataReferencia)}
                </td>
                <td className="px-4 py-3">{movimento.tipo}</td>
                <td className="px-4 py-3">
                  {minutosParaHoraTexto(movimento.minutos)}
                </td>
                <td className="px-4 py-3">{movimento.descricao ?? "-"}</td>
              </tr>
            ))}

            {movimentos.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-slate-500"
                >
                  Nenhum movimento registrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
