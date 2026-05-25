import Link from "next/link";
import type { TipoPerfilSistema } from "@prisma-generated/client";
import { menuItems } from "./menu-items";

type SidebarProps = {
  activeProfileType: TipoPerfilSistema | null;
};

export function Sidebar({ activeProfileType }: SidebarProps) {
  const items = activeProfileType
    ? menuItems.filter((item) => item.perfis.includes(activeProfileType))
    : [];

  return (
    <aside className="hidden min-h-screen w-72 border-r border-slate-200 bg-slate-950 text-white lg:block">
      <div className="border-b border-slate-800 p-6">
        <h1 className="text-xl font-bold tracking-tight">SECP</h1>
        <p className="mt-1 text-xs text-slate-400">
          Controle Eletrônico de Ponto
        </p>
      </div>

      <nav className="space-y-1 p-4">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}

        {!activeProfileType && (
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-100">
            Selecione um perfil ativo para carregar o menu.
          </div>
        )}
      </nav>
    </aside>
  );
}
