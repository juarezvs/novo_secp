type ServidorTableItem = {
  id: string;
  matricula: string;
  cpf: string;
  nomeFuncional: string;
  cargo: string | null;
  funcao: string | null;
  ativo: boolean;
  usuario: {
    login: string;
    email: string | null;
  };
  lotacoes: Array<{
    unidade: {
      sigla: string;
      nome: string;
    };
  }>;
  jornadas: Array<{
    jornada: {
      nome: string;
      cargaMinutosDia: number;
    };
  }>;
};

type ServidoresTableProps = {
  servidores: ServidorTableItem[];
};

function mascararCpf(cpf: string) {
  return cpf.replace(/^(\d{3})\d{5}(\d{3})$/, "$1.***.***-$2");
}

export function ServidoresTable({ servidores }: ServidoresTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-5">
        <h2 className="text-lg font-semibold text-slate-900">
          Servidores cadastrados
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Matrícula</th>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">CPF</th>
              <th className="px-4 py-3">Login</th>
              <th className="px-4 py-3">Lotação</th>
              <th className="px-4 py-3">Jornada</th>
              <th className="px-4 py-3">Cargo/Função</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {servidores.map((servidor) => {
              const lotacao = servidor.lotacoes[0]?.unidade;
              const jornada = servidor.jornadas[0]?.jornada;

              return (
                <tr key={servidor.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    {servidor.matricula}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {servidor.nomeFuncional}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {mascararCpf(servidor.cpf)}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {servidor.usuario.login}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {lotacao ? `${lotacao.sigla}` : "-"}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {jornada
                      ? `${jornada.nome} (${jornada.cargaMinutosDia / 60}h)`
                      : "-"}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {[servidor.cargo, servidor.funcao]
                      .filter(Boolean)
                      .join(" / ") || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                      {servidor.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                </tr>
              );
            })}

            {servidores.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-8 text-center text-slate-500"
                >
                  Nenhum servidor cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
