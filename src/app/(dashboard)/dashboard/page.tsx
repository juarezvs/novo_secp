import { auth } from "@/auth";
import { Breadcrumb } from "@/components/layout/breadcrumb";

export default async function DashboardPage() {
  const session = await auth();

  const activeProfile = session?.user.perfis.find(
    (perfil) => perfil.id === session.user.activeProfileId,
  );

  return (
    <>
      <Breadcrumb items={[{ label: "Dashboard" }]} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Perfil ativo</p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900">
            {activeProfile?.nome ?? "Não selecionado"}
          </h3>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Espelho do mês</p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900">
            Em aberto
          </h3>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Banco de horas</p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900">00h00</h3>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Solicitações pendentes</p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900">0</h3>
        </div>
      </div>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Visão geral</h2>

        <p className="mt-2 text-sm text-slate-600">
          Este painel será adaptado conforme o perfil ativo do usuário.
        </p>
      </section>
    </>
  );
}
