import { Breadcrumb } from "@/components/layout/breadcrumb";

export default function AcessoNegadoPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Acesso negado" }]} />

      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-900">
        <h1 className="text-lg font-semibold">Acesso negado</h1>

        <p className="mt-2 text-sm">
          Seu perfil ativo não possui permissão para acessar este recurso.
        </p>
      </div>
    </>
  );
}
