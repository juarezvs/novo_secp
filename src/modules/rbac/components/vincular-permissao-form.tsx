import { vincularPermissaoPerfil } from "../actions/vincular-permissao-perfil";

type Props = {
  perfis: Array<{
    id: string;
    nome: string;
  }>;
  permissoes: Array<{
    id: string;
    recurso: string;
    acao: string;
    escopo: string;
  }>;
};

export function VincularPermissaoForm({ perfis, permissoes }: Props) {
  return (
    <form
      action={vincularPermissaoPerfil}
      className="rounded-2xl border bg-white p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-slate-900">
        Vincular permissão ao perfil
      </h2>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <select
          name="perfilId"
          required
          className="rounded-lg border px-3 py-2"
        >
          <option value="">Selecione o perfil</option>
          {perfis.map((perfil) => (
            <option key={perfil.id} value={perfil.id}>
              {perfil.nome}
            </option>
          ))}
        </select>

        <select
          name="permissaoId"
          required
          className="rounded-lg border px-3 py-2 md:col-span-2"
        >
          <option value="">Selecione a permissão</option>
          {permissoes.map((permissao) => (
            <option key={permissao.id} value={permissao.id}>
              {permissao.recurso}:{permissao.acao}:{permissao.escopo}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-5 flex justify-end">
        <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
          Vincular
        </button>
      </div>
    </form>
  );
}
