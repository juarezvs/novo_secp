import Link from "next/link";
import {
  BarChart3,
  CalendarCheck,
  Clock,
  FileText,
  Gauge,
  Users,
} from "lucide-react";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { requirePermission } from "@/lib/auth/permissions";

const relatorios = [
  {
    title: "Espelho de Ponto",
    description: "Consulta mensal por servidor.",
    href: "/espelho",
    icon: FileText,
  },
  {
    title: "Banco de Horas",
    description: "Saldo mensal de crédito e débito.",
    href: "/banco-horas",
    icon: Gauge,
  },
  {
    title: "Homologações",
    description: "Situação mensal das unidades.",
    href: "/homologacao",
    icon: CalendarCheck,
  },
  {
    title: "Boletins de Frequência",
    description: "Boletins gerados e enviados à SECAP/NUCGP.",
    href: "/boletim-frequencia",
    icon: Clock,
  },
  {
    title: "Servidores",
    description: "Servidores, lotações, jornadas e status.",
    href: "/servidores",
    icon: Users,
  },
  {
    title: "Auditoria",
    description: "Eventos, alterações e trilhas do sistema.",
    href: "/auditoria",
    icon: BarChart3,
  },
];

export default async function RelatoriosPage() {
  await requirePermission({
    recurso: "relatorios",
    acao: "read",
    escopo: "global",
  });

  return (
    <>
      <Breadcrumb items={[{ label: "Relatórios" }]} />

      <div className="mb-6 rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">
          Relatórios do SECP
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Consultas gerenciais, operacionais e institucionais sobre frequência,
          banco de horas, homologações, boletins e auditoria.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {relatorios.map((relatorio) => {
          const Icon = relatorio.icon;

          return (
            <Link
              key={relatorio.href}
              href={relatorio.href}
              className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-slate-100 p-3">
                  <Icon className="h-5 w-5 text-slate-700" />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900">
                    {relatorio.title}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {relatorio.description}
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
