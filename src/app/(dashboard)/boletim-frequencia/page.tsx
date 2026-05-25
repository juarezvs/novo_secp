import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { getBoletinsFrequencia } from "@/modules/boletim-frequencia/queries/get-boletins";
import { getHomologacoesSemBoletim } from "@/modules/boletim-frequencia/queries/get-homologacoes-sem-boletim";
import { BoletinsTable } from "@/modules/boletim-frequencia/components/boletins-table";
import { HomologacoesSemBoletimTable } from "@/modules/boletim-frequencia/components/homologacoes-sem-boletim-table";

type Props = {
  searchParams?: Promise<{
    ano?: string;
    mes?: string;
  }>;
};

export default async function BoletimFrequenciaPage({ searchParams }: Props) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const activeProfile = session.user.perfis.find(
    (perfil) => perfil.id === session.user.activeProfileId,
  );

  const params = await searchParams;
  const hoje = new Date();

  const ano = params?.ano ? Number(params.ano) : undefined;
  const mes = params?.mes ? Number(params.mes) : undefined;

  const unidadeId =
    activeProfile?.tipo === "GESTOR" ||
    activeProfile?.tipo === "DELEGADO_CHEFIA"
      ? (activeProfile.unidadeId ?? undefined)
      : undefined;

  const [homologacoesSemBoletim, boletins] = await Promise.all([
    getHomologacoesSemBoletim({
      unidadeId,
      ano,
      mes,
    }),
    getBoletinsFrequencia({
      unidadeId,
      ano,
      mes,
    }),
  ]);

  return (
    <>
      <Breadcrumb items={[{ label: "Boletim de Frequência" }]} />

      <div className="mb-6 rounded-2xl border bg-white p-5 shadow-sm">
        <form className="flex flex-wrap items-end gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Ano</label>
            <input
              name="ano"
              type="number"
              defaultValue={ano ?? hoje.getFullYear()}
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
              defaultValue={mes ?? hoje.getMonth() + 1}
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
      </div>

      <div className="space-y-6">
        <HomologacoesSemBoletimTable homologacoes={homologacoesSemBoletim} />

        <BoletinsTable boletins={boletins} />
      </div>
    </>
  );
}
