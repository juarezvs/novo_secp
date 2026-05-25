import type { MarcacaoPonto } from "@prisma-generated/client";

type MarcacoesDiaCardProps = {
  marcacoes: MarcacaoPonto[];
};

function formatarHora(data: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(data);
}

export function MarcacoesDiaCard({ marcacoes }: MarcacoesDiaCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">
        Marcações de hoje
      </h2>

      <div className="mt-4 space-y-3">
        {marcacoes.map((marcacao) => (
          <div
            key={marcacao.id}
            className="flex items-center justify-between rounded-xl border border-slate-200 p-4"
          >
            <div>
              <p className="font-medium text-slate-900">{marcacao.tipo}</p>
              <p className="text-sm text-slate-500">
                Origem: {marcacao.origem}
              </p>
            </div>

            <div className="text-right">
              <p className="font-semibold text-slate-900">
                {formatarHora(marcacao.dataHora)}
              </p>
              <p className="text-xs text-slate-500">{marcacao.status}</p>
            </div>
          </div>
        ))}

        {marcacoes.length === 0 && (
          <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
            Nenhuma marcação registrada hoje.
          </p>
        )}
      </div>
    </div>
  );
}
