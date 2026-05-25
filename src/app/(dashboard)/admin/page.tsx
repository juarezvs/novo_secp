import Link from "next/link";
import {
  Building2,
  Clock,
  LockKeyhole,
  Settings,
  Users,
  History,
} from "lucide-react";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { requirePermission } from "@/lib/auth/permissions";

const cards = [
  {
    title: "Unidades",
    description: "Gerencie a estrutura organizacional.",
    href: "/unidades",
    icon: Building2,
  },
  {
    title: "Servidores",
    description: "Cadastre servidores, lotações e jornadas.",
    href: "/servidores",
    icon: Users,
  },
  {
    title: "Jornadas",
    description: "Configure jornadas de 7h, 8h e especiais.",
    href: "/jornadas",
    icon: Clock,
  },
  {
    title: "RBAC",
    description: "Gerencie perfis e permissões.",
    href: "/admin/rbac",
    icon: LockKeyhole,
  },
  {
    title: "Auditoria",
    description: "Consulte trilhas de auditoria.",
    href: "/auditoria",
    icon: History,
  },
];

export default async function AdminPage() {
  await requirePermission({
    recurso: "configuracoes",
    acao: "manage",
    escopo: "global",
  });

  return (
    <>
      <Breadcrumb items={[{ label: "Administração" }]} />

      <div className="mb-6 rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-slate-100 p-3">
            <Settings className="h-6 w-6 text-slate-700" />
          </div>

          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              Administração do SECP
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Configurações estruturais, segurança, cadastros e auditoria.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <Link
              key={card.href}
              href={card.href}
              className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-slate-100 p-3">
                  <Icon className="h-5 w-5 text-slate-700" />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900">{card.title}</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {card.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
