import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { getHomologacaoMensal } from "@/modules/homologacao/queries/get-homologacao-mensal";
import { HomologacaoActions } from "@/modules/homologacao/components/homologacao-actions";
import { HomologacaoTable } from "@/modules/homologacao/components/homologacao-table";

type Props = {
  searchParams?: Promise<{
    ano?: string;
    mes?: string;
  }>;
};

export default async function HomologacaoPage({ searchParams }: Props) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const activeProfile = session.user.perfis.find(
    (perfil) => perfil.id === session.user.activeProfileId,
  );

  if (!activeProfile?.unidadeId) {
    return (
      <>
        <Breadcrumb items={[{ label: "Homologação" }]} />

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
          Selecione um perfil ativo vinculado a uma unidade.
        </div>
      </>
    );
  }

  const params = await searchParams;
  const hoje = new Date();
  const ano = Number(params?.ano ?? hoje.getFullYear());
  const mes = Number(params?.mes ?? hoje.getMonth() + 1);

  const homologacao = await getHomologacaoMensal(
    activeProfile.unidadeId,
    ano,
    mes,
  );

  const pendencias =
    homologacao?.servidores.filter((item) => item.possuiPendencia).length ?? 0;

  const podeFechar =
    Boolean(homologacao) &&
    pendencias === 0 &&
    homologacao?.status !== "HOMOLOGADA";

  return (
    <>
      <Breadcrumb items={[{ label: "Homologação" }]} />

      <div className="mb-6 rounded-2xl border bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <form className="flex flex-wrap items-end gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Ano</label>
              <input
                name="ano"
                type="number"
                defaultValue={ano}
                className="mt-1 w-32 rounded-lg border border-slate-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Mês</label>
              <input
                name="mes"
                type="number"
                min={1}
                max={12}
                defaultValue={mes}
                className="mt-1 w-24 rounded-lg border border-slate-300 px-3 py-2"
              />
            </div>

            <button
              type="submit"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold"
            >
              Filtrar
            </button>
          </form>

          <HomologacaoActions
            unidadeId={activeProfile.unidadeId}
            ano={ano}
            mes={mes}
            homologacaoId={homologacao?.id}
            podeFechar={podeFechar}
          />
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Status</p>
          <h3 className="mt-2 text-xl font-semibold">
            {homologacao?.status ?? "Não gerada"}
          </h3>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Pendências</p>
          <h3 className="mt-2 text-xl font-semibold">{pendencias}</h3>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Unidade</p>
          <h3 className="mt-2 text-xl font-semibold">
            {activeProfile.unidadeSigla ?? "-"}
          </h3>
        </div>
      </div>

      <HomologacaoTable itens={homologacao?.servidores ?? []} />
    </>
  );
}
