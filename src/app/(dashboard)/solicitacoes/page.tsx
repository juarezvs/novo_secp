import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { getServidorByUserId } from "@/modules/servidores/queries/get-servidor-by-user";
import { getMinhasSolicitacoes } from "@/modules/solicitacoes/queries/get-minhas-solicitacoes";
import { SolicitacaoAjustePontoForm } from "@/modules/solicitacoes/components/solicitacao-ajuste-ponto-form";
import { MinhasSolicitacoesTable } from "@/modules/solicitacoes/components/minhas-solicitacoes-table";

export default async function SolicitacoesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const servidor = await getServidorByUserId(session.user.id);

  if (!servidor) {
    return (
      <>
        <Breadcrumb items={[{ label: "Solicitações" }]} />

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
          Seu usuário ainda não possui cadastro funcional.
        </div>
      </>
    );
  }

  const solicitacoes = await getMinhasSolicitacoes(servidor.id);

  return (
    <>
      <Breadcrumb items={[{ label: "Solicitações" }]} />

      <div className="space-y-6">
        <SolicitacaoAjustePontoForm />
        <MinhasSolicitacoesTable solicitacoes={solicitacoes} />
      </div>
    </>
  );
}
