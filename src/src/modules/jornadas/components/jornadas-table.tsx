import type { TipoJornada } from "@prisma-generated/client";

type JornadaTableItem = {
  id: string;
  nome: string;
  tipo: TipoJornada;
  cargaMinutosDia: number;
  exigeIntervalo: boolean;
  intervaloMinMinutos: number | null;
  intervaloMaxMinutos: number | null;
  horarioInicioPadrao: string | null;
  horarioFimPadrao: string | null;
  ativa: boolean;
  _count: {
    unidades: number;
    servidores: number;
  };
};

type JornadasTableProps = {
  jornadas: JornadaTableItem[];
};

function minutosParaHoras(minutos: number) {
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return `${String(h).padStart(2, "0")}h${String(m).padStart(2, "0")}`;
}

export function JornadasTable({ jornadas }: JornadasTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-5">
        <h2 className="text-lg font-semibold text-slate-900">
          Jornadas cadastradas
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Carga</th>
              <th className="px-4 py-3">Intervalo</th>
              <th className="px-4 py-3">Horário padrão</th>
              <th className="px-4 py-3">Unidades</th>
              <th className="px-4 py-3">Servidores</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {jornadas.map((jornada) => (
              <tr key={jornada.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-semibold text-slate-900">
                  {jornada.nome}
                </td>
                <td className="px-4 py-3 text-slate-700">{jornada.tipo}</td>
                <td className="px-4 py-3 text-slate-700">
                  {minutosParaHoras(jornada.cargaMinutosDia)}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {jornada.exigeIntervalo
                    ? `${jornada.intervaloMinMinutos} a ${jornada.intervaloMaxMinutos} min`
                    : "Não exige"}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {jornada.horarioInicioPadrao && jornada.horarioFimPadrao
                    ? `${jornada.horarioInicioPadrao} às ${jornada.horarioFimPadrao}`
                    : "-"}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {jornada._count.unidades}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {jornada._count.servidores}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                    {jornada.ativa ? "Ativa" : "Inativa"}
                  </span>
                </td>
              </tr>
            ))}

            {jornadas.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-8 text-center text-slate-500"
                >
                  Nenhuma jornada cadastrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
