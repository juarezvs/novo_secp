import type {
  Solicitacao,
  DecisaoSolicitacao,
  Usuario,
} from "@prisma-generated/client";

type SolicitacaoComDecisoes = Solicitacao & {
  decisoes: Array<DecisaoSolicitacao & { usuario: Usuario }>;
};

type Props = {
  solicitacoes: SolicitacaoComDecisoes[];
};

function formatarData(data: Date | null) {
  if (!data) return "-";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(data);
}

export function MinhasSolicitacoesTable({ solicitacoes }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-5">
        <h2 className="text-lg font-semibold text-slate-900">
          Minhas solicitações
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Criada em</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Data referência</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Resposta</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {solicitacoes.map((solicitacao) => {
              const decisao = solicitacao.decisoes[0];

              return (
                <tr key={solicitacao.id}>
                  <td className="px-4 py-3">
                    {formatarData(solicitacao.criadaEm)}
                  </td>
                  <td className="px-4 py-3">{solicitacao.tipo}</td>
                  <td className="px-4 py-3">
                    {formatarData(solicitacao.dataReferencia)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium">
                      {solicitacao.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {decisao
                      ? `${decisao.aprovada ? "Aprovada" : "Indeferida"} por ${decisao.usuario.nome}`
                      : "-"}
                  </td>
                </tr>
              );
            })}

            {solicitacoes.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-slate-500"
                >
                  Nenhuma solicitação registrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
