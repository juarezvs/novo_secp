import { Breadcrumb } from "@/components/layout/breadcrumb";
import { prisma } from "@/shared/lib/prisma";
import { UnidadeForm } from "@/modules/unidades/components/unidade-form";
import { UnidadesTable } from "@/modules/unidades/components/unidades-table";
import { getUnidades } from "@/modules/unidades/queries/get-unidades";

export default async function UnidadesPage() {
  const [orgaos, unidades] = await Promise.all([
    prisma.orgao.findMany({
      orderBy: { sigla: "asc" },
    }),
    getUnidades(),
  ]);

  return (
    <>
      <Breadcrumb items={[{ label: "Unidades" }]} />

      <div className="space-y-6">
        <UnidadeForm
          orgaos={orgaos}
          unidadesPai={unidades.map((unidade) => ({
            id: unidade.id,
            sigla: unidade.sigla,
            nome: unidade.nome,
          }))}
        />

        <UnidadesTable unidades={unidades} />
      </div>
    </>
  );
}
