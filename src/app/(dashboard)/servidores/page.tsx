import { Breadcrumb } from "@/components/layout/breadcrumb";
import { prisma } from "@/shared/lib/prisma";
import { ServidorForm } from "@/modules/servidores/components/servidor-form";
import { ServidoresTable } from "@/modules/servidores/components/servidores-table";
import { getServidores } from "@/modules/servidores/queries/get-servidores";

export default async function ServidoresPage() {
  const [servidores, unidades, jornadas] = await Promise.all([
    getServidores(),
    prisma.unidadeOrganizacional.findMany({
      where: { ativa: true },
      orderBy: { sigla: "asc" },
    }),
    prisma.jornada.findMany({
      where: { ativa: true },
      orderBy: { nome: "asc" },
    }),
  ]);

  return (
    <>
      <Breadcrumb items={[{ label: "Servidores" }]} />

      <div className="space-y-6">
        <ServidorForm unidades={unidades} jornadas={jornadas} />
        <ServidoresTable servidores={servidores} />
      </div>
    </>
  );
}
