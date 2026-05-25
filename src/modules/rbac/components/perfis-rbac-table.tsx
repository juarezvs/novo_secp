type PerfilItem = {
  id: string;
  nome: string;
  tipo: string;
  ativo: boolean;
  _count: {
    usuarios: number;
  };
  permissoes: Array<{
    permissao: {
      id: string;
      recurso: string;
      acao: string;
      escopo: string;
    };
  }>;
};

type Props = {
  perfis: PerfilItem[];
};

export function PerfisRbacTable({ perfis }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="border-b p-5">
        <h2 className="text-lg font-semibold text-slate-900">
          Perfis e permissões
        </h2>
      </div>

      <div className="divide-y">
        {perfis.map((perfil) => (
          <details key={perfil.id} className="p-5">
            <summary className="cursor-pointer font-semibold text-slate-900">
              {perfil.nome} — {perfil.tipo} — {perfil._count.usuarios}{" "}
              usuário(s)
            </summary>

            <div className="mt-4 flex flex-wrap gap-2">
              {perfil.permissoes.map(({ permissao }) => (
                <span
                  key={permissao.id}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                >
                  {permissao.recurso}:{permissao.acao}:{permissao.escopo}
                </span>
              ))}

              {perfil.permissoes.length === 0 && (
                <p className="text-sm text-slate-500">
                  Nenhuma permissão vinculada.
                </p>
              )}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
