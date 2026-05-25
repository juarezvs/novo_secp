import type { TipoPerfilSistema } from "@prisma-generated/client";
import {
  BarChart3,
  Clock,
  FileCheck,
  FileText,
  Gauge,
  History,
  Landmark,
  LayoutDashboard,
  LockKeyhole,
  Settings,
  ShieldCheck,
  Users,
  Building2,
} from "lucide-react";

export type MenuItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  perfis: TipoPerfilSistema[];
};

export const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    perfis: [
      "SERVIDOR",
      "GESTOR",
      "DELEGADO_CHEFIA",
      "ADMIN",
      "NUTEC",
      "SECAP_NUCGP",
      "SECAD",
      "DIREF",
      "AUDITOR",
      "CUSTOMIZADO",
    ],
  },
  {
    label: "Registrar Ponto",
    href: "/ponto",
    icon: Clock,
    perfis: ["SERVIDOR", "GESTOR", "DELEGADO_CHEFIA", "NUTEC"],
  },
  {
    label: "Espelho de Ponto",
    href: "/espelho",
    icon: FileText,
    perfis: ["SERVIDOR", "GESTOR", "DELEGADO_CHEFIA", "SECAP_NUCGP"],
  },
  {
    label: "Banco de Horas",
    href: "/banco-horas",
    icon: Gauge,
    perfis: ["SERVIDOR", "GESTOR", "DELEGADO_CHEFIA", "SECAP_NUCGP"],
  },
  {
    label: "Solicitações",
    href: "/solicitacoes",
    icon: FileCheck,
    perfis: ["SERVIDOR", "GESTOR", "DELEGADO_CHEFIA"],
  },
  {
    label: "Homologação",
    href: "/homologacao",
    icon: ShieldCheck,
    perfis: ["GESTOR", "DELEGADO_CHEFIA"],
  },
  {
    label: "Boletim de Frequência",
    href: "/boletim-frequencia",
    icon: Landmark,
    perfis: ["GESTOR", "DELEGADO_CHEFIA", "SECAP_NUCGP", "DIREF"],
  },
  {
    label: "Servidores",
    href: "/servidores",
    icon: Users,
    perfis: ["ADMIN", "NUTEC", "SECAP_NUCGP"],
  },
  {
    label: "Relatórios",
    href: "/relatorios",
    icon: BarChart3,
    perfis: ["ADMIN", "NUTEC", "SECAP_NUCGP", "SECAD", "DIREF", "AUDITOR"],
  },
  {
    label: "Auditoria",
    href: "/auditoria",
    icon: History,
    perfis: ["ADMIN", "NUTEC", "SECAP_NUCGP", "SECAD", "DIREF", "AUDITOR"],
  },
  {
    label: "RBAC",
    href: "/admin/rbac",
    icon: LockKeyhole,
    perfis: ["ADMIN"],
  },
  {
    label: "Administração",
    href: "/admin",
    icon: Settings,
    perfis: ["ADMIN", "NUTEC"],
  },
  {
    label: "Unidades",
    href: "/unidades",
    icon: Building2,
    perfis: ["ADMIN", "NUTEC"],
  },
  {
    label: "Jornadas",
    href: "/jornadas",
    icon: Clock,
    perfis: ["ADMIN", "NUTEC"],
  },
  {
    label: "Minhas Solicitações",
    href: "/solicitacoes",
    icon: FileCheck,
    perfis: ["SERVIDOR", "GESTOR", "DELEGADO_CHEFIA"],
  },
  {
    label: "Solicitações da Equipe",
    href: "/chefia/solicitacoes",
    icon: ShieldCheck,
    perfis: ["GESTOR", "DELEGADO_CHEFIA"],
  },
];
