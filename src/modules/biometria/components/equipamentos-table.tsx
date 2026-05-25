type EquipamentoItem = {
  id: string;
  nome: string;
  codigo: string;
  localizacao: string | null;
  ip: string | null;
  ativo: boolean;
  unidade: {
    sigla: string;
    nome: string;
  };
  _count: {
    marcacoes: number;
  };
};

type Props = {
  equipamentos: EquipamentoItem[];
};

export function EquipamentosTable({ equipamentos }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="border-b p-5">
        <h2 className="text-lg font-semibold text-slate-900">
          Equipamentos cadastrados
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Código</th>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Unidade</th>
              <th className="px-4 py-3">IP</th>
              <th className="px-4 py-3">Localização</th>
              <th className="px-4 py-3">Marcações</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {equipamentos.map((equipamento) => (
              <tr key={equipamento.id}>
                <td className="px-4 py-3 font-semibold">
                  {equipamento.codigo}
                </td>
                <td className="px-4 py-3">{equipamento.nome}</td>
                <td className="px-4 py-3">{equipamento.unidade.sigla}</td>
                <td className="px-4 py-3">{equipamento.ip ?? "-"}</td>
                <td className="px-4 py-3">{equipamento.localizacao ?? "-"}</td>
                <td className="px-4 py-3">{equipamento._count.marcacoes}</td>
                <td className="px-4 py-3">
                  {equipamento.ativo ? "Ativo" : "Inativo"}
                </td>
              </tr>
            ))}

            {equipamentos.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-slate-500"
                >
                  Nenhum equipamento cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
