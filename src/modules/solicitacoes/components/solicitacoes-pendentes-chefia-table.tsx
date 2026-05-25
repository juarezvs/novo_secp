import type {
  DecisaoSolicitacao,
  Servidor,
  Solicitacao,
  UnidadeOrganizacional,
  Usuario,
  LotacaoServidor,
} from "@prisma-generated/client";
import { decidirSolicitacao } from "../actions/decidir-solicitacao";

type SolicitacaoChefia = Solicitacao & {
  servidor: Servidor & {
    usuario: Usuario;
    lotacoes: Array<
      LotacaoServidor & {
        unidade: UnidadeOrganizacional;
      }
    >;
  };
  solicitante: Usuario;
  decisoes: Array<DecisaoSolicitacao & { usuario: Usuario }>;
};

type Props = {
  solicitacoes: SolicitacaoChefia[];
};

function formatarData(data: Date | null) {
  if (!data) return "-";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(data);
}

export function SolicitacoesPendentesChefiaTable({ solicitacoes }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-5">
        <h2 className="text-lg font-semibold text-slate-900">
          Solicitações pendentes da equipe
        </h2>
      </div>

      <div className="divide-y divide-slate-100">
        {solicitacoes.map((solicitacao) => {
          const unidade = solicitacao.servidor.lotacoes[0]?.unidade;

          return (
            <div key={solicitacao.id} className="p-5">
              <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                      {solicitacao.tipo}
                    </span>
                    <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
                      {solicitacao.status}
                    </span>
                  </div>

                  <h3 className="mt-3 text-base font-semibold text-slate-900">
                    {solicitacao.servidor.nomeFuncional}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Unidade: {unidade?.sigla ?? "-"} • Matrícula:{" "}
                    {solicitacao.servidor.matricula}
                  </p>

                  <dl className="mt-4 grid gap-3 text-sm md:grid-cols-3">
                    <div>
                      <dt className="text-slate-500">Criada em</dt>
                      <dd className="font-medium text-slate-800">
                        {formatarData(solicitacao.criadaEm)}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-slate-500">Data referência</dt>
                      <dd className="font-medium text-slate-800">
                        {formatarData(solicitacao.dataReferencia)}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-slate-500">Horário solicitado</dt>
                      <dd className="font-medium text-slate-800">
                        {formatarData(solicitacao.inicioEm)}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
                    {solicitacao.justificativa}
                  </div>
                </div>

                <form
                  action={decidirSolicitacao}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <input
                    type="hidden"
                    name="solicitacaoId"
                    value={solicitacao.id}
                  />

                  <label className="text-sm font-medium text-slate-700">
                    Observação da chefia
                  </label>

                  <textarea
                    name="observacao"
                    rows={4}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    placeholder="Informe a justificativa da decisão."
                  />

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      type="submit"
                      name="decisao"
                      value="INDEFERIR"
                      className="rounded-lg border border-red-300 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
                    >
                      Indeferir
                    </button>

                    <button
                      type="submit"
                      name="decisao"
                      value="APROVAR"
                      className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                      Aprovar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          );
        })}

        {solicitacoes.length === 0 && (
          <div className="p-8 text-center text-sm text-slate-500">
            Nenhuma solicitação pendente.
          </div>
        )}
      </div>
    </div>
  );
}
