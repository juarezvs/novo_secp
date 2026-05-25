import { Breadcrumb } from "@/components/layout/breadcrumb";
import { getAuditorias } from "@/modules/auditoria/queries/get-auditorias";
import { AuditoriaTable } from "@/modules/auditoria/components/auditoria-table";

type Props = {
  searchParams?: Promise<{
    tipoEvento?: string;
    entidade?: string;
    usuario?: string;
  }>;
};

export default async function AuditoriaPage({ searchParams }: Props) {
  const params = await searchParams;

  const auditorias = await getAuditorias({
    tipoEvento: params?.tipoEvento,
    entidade: params?.entidade,
    usuario: params?.usuario,
  });

  return (
    <>
      <Breadcrumb items={[{ label: "Auditoria" }]} />

      <div className="mb-6 rounded-2xl border bg-white p-5 shadow-sm">
        <form className="grid gap-4 md:grid-cols-4">
          <div>
            <label className="text-sm font-medium text-slate-700">
              Tipo de evento
            </label>
            <input
              name="tipoEvento"
              defaultValue={params?.tipoEvento ?? ""}
              placeholder="CREATE, UPDATE, APPROVE..."
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Entidade
            </label>
            <input
              name="entidade"
              defaultValue={params?.entidade ?? ""}
              placeholder="Solicitacao, BancoHoras..."
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Usuário
            </label>
            <input
              name="usuario"
              defaultValue={params?.usuario ?? ""}
              placeholder="Nome, login ou e-mail"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            >
              Filtrar
            </button>
          </div>
        </form>
      </div>

      <AuditoriaTable auditorias={auditorias} />
    </>
  );
}
