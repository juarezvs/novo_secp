import type { EspelhoDiario } from "@prisma-generated/client";
import { minutosParaHoraTexto } from "@/shared/utils/time";

type Props = {
  espelhos: EspelhoDiario[];
};

function formatarData(data: Date) {
  return new Intl.DateTimeFormat("pt-BR").format(data);
}

export function EspelhoMensalTable({ espelhos }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-5">
        <h2 className="text-lg font-semibold text-slate-900">Espelho mensal</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3">Previsto</th>
              <th className="px-4 py-3">Realizado</th>
              <th className="px-4 py-3">Intervalo</th>
              <th className="px-4 py-3">Crédito</th>
              <th className="px-4 py-3">Débito</th>
              <th className="px-4 py-3">Situação</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {espelhos.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-semibold text-slate-900">
                  {formatarData(item.dataReferencia)}
                </td>
                <td className="px-4 py-3">
                  {minutosParaHoraTexto(item.jornadaPrevistaMinutos)}
                </td>
                <td className="px-4 py-3">
                  {minutosParaHoraTexto(item.jornadaRealizadaMinutos)}
                </td>
                <td className="px-4 py-3">
                  {minutosParaHoraTexto(item.intervaloMinutos)}
                </td>
                <td className="px-4 py-3">
                  {minutosParaHoraTexto(item.creditoMinutos)}
                </td>
                <td className="px-4 py-3">
                  {minutosParaHoraTexto(item.debitoMinutos)}
                </td>
                <td className="px-4 py-3">
                  {item.possuiInconsistencia ? "Pendente" : "Regular"}
                </td>
              </tr>
            ))}

            {espelhos.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-slate-500"
                >
                  Nenhum espelho diário calculado neste mês.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
