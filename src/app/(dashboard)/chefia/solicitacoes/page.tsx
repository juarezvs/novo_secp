import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { getSolicitacoesPendentesChefia } from "@/modules/solicitacoes/queries/get-solicitacoes-pendentes-chefia";
import { SolicitacoesPendentesChefiaTable } from "@/modules/solicitacoes/components/solicitacoes-pendentes-chefia-table";

export default async function SolicitacoesChefiaPage() {
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
        <Breadcrumb items={[{ label: "Chefia" }, { label: "Solicitações" }]} />

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
          Selecione um perfil ativo vinculado a uma unidade.
        </div>
      </>
    );
  }

  const solicitacoes = await getSolicitacoesPendentesChefia(
    activeProfile.unidadeId,
  );

  return (
    <>
      <Breadcrumb items={[{ label: "Chefia" }, { label: "Solicitações" }]} />

      <SolicitacoesPendentesChefiaTable solicitacoes={solicitacoes} />
    </>
  );
}
