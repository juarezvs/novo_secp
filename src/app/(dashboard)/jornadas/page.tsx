import { Breadcrumb } from "@/components/layout/breadcrumb";
import { JornadaForm } from "@/modules/jornadas/components/jornada-form";
import { JornadasTable } from "@/src/modules/jornadas/components/jornadas-table";
import { getJornadas } from "@/modules/jornadas/queries/get-jornadas";

export default async function JornadasPage() {
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
