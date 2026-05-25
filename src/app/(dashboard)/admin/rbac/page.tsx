import { Breadcrumb } from "@/components/layout/breadcrumb";
import { getRbacOverview } from "@/modules/rbac/queries/get-rbac-overview";
import { PermissaoForm } from "@/modules/rbac/components/permissao-form";
import { VincularPermissaoForm } from "@/modules/rbac/components/vincular-permissao-form";
import { PerfisRbacTable } from "@/modules/rbac/components/perfis-rbac-table";
import { requirePermission } from "@/lib/auth/permissions";

export default async function RbacPage() {
  await requirePermission({
    recurso: "perfis",
    acao: "manage",
    escopo: "global",
  });
  const { perfis, permissoes } = await getRbacOverview();

  return (
    <>
      <Breadcrumb items={[{ label: "Administração" }, { label: "RBAC" }]} />

      <div className="space-y-6">
        <PermissaoForm />

        <VincularPermissaoForm perfis={perfis} permissoes={permissoes} />

        <PerfisRbacTable perfis={perfis} />
      </div>
    </>
  );
}
