import type { Auditoria, Usuario } from "@prisma-generated/client";

type AuditoriaItem = Auditoria & {
  usuario: Usuario | null;
};

type Props = {
  auditorias: AuditoriaItem[];
};

function formatarData(data: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "medium",
  }).format(data);
}

function formatarJson(valor: unknown) {
  if (!valor) return "-";

  try {
    return JSON.stringify(valor, null, 2);
  } catch {
    return String(valor);
  }
}

export function AuditoriaTable({ auditorias }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="border-b p-5">
        <h2 className="text-lg font-semibold text-slate-900">
          Trilhas de auditoria
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Últimos 100 eventos registrados no sistema.
        </p>
      </div>

      <div className="divide-y divide-slate-100">
        {auditorias.map((item) => (
          <details key={item.id} className="group p-5">
            <summary className="cursor-pointer list-none">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                      {item.tipoEvento}
                    </span>

                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                      {item.entidade}
                    </span>
                  </div>

                  <h3 className="mt-3 font-semibold text-slate-900">
                    {item.descricao ?? "Evento sem descrição"}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Usuário: {item.usuario?.nome ?? "Sistema"} • Perfil:{" "}
                    {item.perfilAtivo ?? "-"}
                  </p>
                </div>

                <p className="text-sm text-slate-500">
                  {formatarData(item.criadoEm)}
                </p>
              </div>
            </summary>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <div>
                <p className="mb-2 text-sm font-semibold text-slate-700">
                  Antes
                </p>
                <pre className="max-h-96 overflow-auto rounded-xl bg-slate-950 p-4 text-xs text-slate-100">
                  {formatarJson(item.payloadAntes)}
                </pre>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-slate-700">
                  Depois
                </p>
                <pre className="max-h-96 overflow-auto rounded-xl bg-slate-950 p-4 text-xs text-slate-100">
                  {formatarJson(item.payloadDepois)}
                </pre>
              </div>
            </div>
          </details>
        ))}

        {auditorias.length === 0 && (
          <div className="p-8 text-center text-sm text-slate-500">
            Nenhum evento de auditoria encontrado.
          </div>
        )}
      </div>
    </div>
  );
}
