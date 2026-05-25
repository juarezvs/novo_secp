import { Breadcrumb } from "@/components/layout/breadcrumb";
import { prisma } from "@/shared/lib/prisma";
import { requirePermission } from "@/lib/auth/permissions";
import { getEquipamentos } from "@/modules/biometria/queries/get-equipamentos";
import { EquipamentoForm } from "@/modules/biometria/components/equipamento-form";
import { EquipamentosTable } from "@/modules/biometria/components/equipamentos-table";

export default async function EquipamentosPage() {
  await requirePermission({
    recurso: "equipamentos",
    acao: "manage",
    escopo: "global",
  });

  const [unidades, equipamentos] = await Promise.all([
    prisma.unidadeOrganizacional.findMany({
      where: { ativa: true },
      orderBy: { sigla: "asc" },
    }),
    getEquipamentos(),
  ]);

  return (
    <>
      <Breadcrumb items={[{ label: "Biometria" }, { label: "Equipamentos" }]} />

      <div className="space-y-6">
        <EquipamentoForm unidades={unidades} />
        <EquipamentosTable equipamentos={equipamentos} />
      </div>
    </>
  );
}
