import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { RegistroPontoCard } from "@/modules/marcacoes/components/registro-ponto-card";
import { MarcacoesDiaCard } from "@/modules/marcacoes/components/marcacoes-dia-card";
import { getMarcacoesDia } from "@/modules/marcacoes/queries/get-marcacoes-dia";
import { getServidorByUserId } from "@/modules/servidores/queries/get-servidor-by-user";
import { getEspelhoDiario } from "@/modules/espelho/queries/get-espelho-diario";
import { EspelhoDiarioCard } from "@/modules/espelho/components/espelho-diario-card";

export default async function PontoPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const servidor = await getServidorByUserId(session.user.id);

  if (!servidor) {
    return (
      <>
        <Breadcrumb items={[{ label: "Registro de Ponto" }]} />

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
          Seu usuário ainda não possui cadastro funcional de servidor.
        </div>
      </>
    );
  }

  const [marcacoes, espelho] = await Promise.all([
    getMarcacoesDia(servidor.id),
    getEspelhoDiario(servidor.id),
  ]);

  return (
    <>
      <Breadcrumb items={[{ label: "Registro de Ponto" }]} />

      <div className="grid gap-6 xl:grid-cols-2">
        <RegistroPontoCard />
        <MarcacoesDiaCard marcacoes={marcacoes} />
      </div>
      <div className="mt-6">
        <EspelhoDiarioCard espelho={espelho} />
      </div>
    </>
  );
}
