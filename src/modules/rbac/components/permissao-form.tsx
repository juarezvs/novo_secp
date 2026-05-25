import { createPermissao } from "../actions/create-permissao";

export function PermissaoForm() {
  return (
    <form
      action={createPermissao}
      className="rounded-2xl border bg-white p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-slate-900">Nova permissão</h2>

      <div className="mt-4 grid gap-4 md:grid-cols-4">
        <input
          name="recurso"
          required
          placeholder="recurso: espelho"
          className="rounded-lg border px-3 py-2"
        />

        <input
          name="acao"
          required
          placeholder="ação: read"
          className="rounded-lg border px-3 py-2"
        />

        <input
          name="escopo"
          required
          placeholder="escopo: self"
          className="rounded-lg border px-3 py-2"
        />

        <input
          name="descricao"
          placeholder="descrição"
          className="rounded-lg border px-3 py-2"
        />
      </div>

      <div className="mt-5 flex justify-end">
        <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
          Salvar permissão
        </button>
      </div>
    </form>
  );
}
