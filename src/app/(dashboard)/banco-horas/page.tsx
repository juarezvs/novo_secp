import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { getServidorByUserId } from "@/modules/servidores/queries/get-servidor-by-user";
import { getBancoHoras } from "@/modules/banco-horas/queries/get-banco-horas";
import { BancoHorasResumo } from "@/modules/banco-horas/components/banco-horas-resumo";
import { MovimentosBancoTable } from "@/modules/banco-horas/components/movimentos-banco-table";
import { RecalcularBancoButton } from "@/modules/banco-horas/components/recalcular-banco-button";

type Props = {
  searchParams?: Promise<{
    ano?: string;
    mes?: string;
  }>;
};

export default async function BancoHorasPage({ searchParams }: Props) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const params = await searchParams;
  const hoje = new Date();

  const ano = Number(params?.ano ?? hoje.getFullYear());
  const mes = Number(params?.mes ?? hoje.getMonth() + 1);

  const servidor = await getServidorByUserId(session.user.id);

  if (!servidor) {
    return (
      <>
        <Breadcrumb items={[{ label: "Banco de Horas" }]} />

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
          Seu usuário ainda não possui cadastro funcional.
        </div>
      </>
    );
  }

  const banco = await getBancoHoras(servidor.id, ano, mes);

  return (
    <>
      <Breadcrumb items={[{ label: "Banco de Horas" }]} />

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
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
            >
              Filtrar
            </button>
          </form>

          <RecalcularBancoButton servidorId={servidor.id} ano={ano} mes={mes} />
        </div>
      </div>

      <div className="space-y-6">
        <BancoHorasResumo banco={banco} />
        <MovimentosBancoTable movimentos={banco?.movimentos ?? []} />
      </div>
    </>
  );
}
