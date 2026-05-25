import { Breadcrumb } from "@/components/layout/breadcrumb";
import { JornadaForm } from "@/modules/jornadas/components/jornada-form";
import { JornadasTable } from "@/src/modules/jornadas/components/jornadas-table";
import { getJornadas } from "@/modules/jornadas/queries/get-jornadas";
import { requirePermission } from "@/lib/auth/permissions";

export default async function JornadasPage() {
  await requirePermission({
    recurso: "jornadas",
    acao: "manage",
    escopo: "global",
  });
  const jornadas = await getJornadas();

  return (
    <>
      <Breadcrumb items={[{ label: "Jornadas" }]} />

      <div className="space-y-6">
        <JornadaForm />
        <JornadasTable jornadas={jornadas} />
      </div>
    </>
  );
}
