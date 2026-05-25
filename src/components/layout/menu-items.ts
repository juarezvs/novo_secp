import {
  BarChart3,
  Building2,
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
} from "lucide-react";

export type MenuItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: {
    recurso: string;
    acao: string;
    escopo: string;
  };
};

export const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Registrar Ponto",
    href: "/ponto",
    icon: Clock,
    permission: {
      recurso: "ponto",
      acao: "create",
      escopo: "self",
    },
  },
  {
    label: "Espelho de Ponto",
    href: "/espelho",
    icon: FileText,
    permission: {
      recurso: "espelho",
      acao: "read",
      escopo: "self",
    },
  },
  {
    label: "Banco de Horas",
    href: "/banco-horas",
    icon: Gauge,
    permission: {
      recurso: "banco-horas",
      acao: "read",
      escopo: "self",
    },
  },
  {
    label: "Minhas Solicitações",
    href: "/solicitacoes",
    icon: FileCheck,
    permission: {
      recurso: "solicitacao",
      acao: "create",
      escopo: "self",
    },
  },
  {
    label: "Solicitações da Equipe",
    href: "/chefia/solicitacoes",
    icon: ShieldCheck,
    permission: {
      recurso: "solicitacao",
      acao: "approve",
      escopo: "subordinados",
    },
  },
  {
    label: "Homologação",
    href: "/homologacao",
    icon: ShieldCheck,
    permission: {
      recurso: "homologacao",
      acao: "close",
      escopo: "unidade",
    },
  },
  {
    label: "Boletim de Frequência",
    href: "/boletim-frequencia",
    icon: Landmark,
    permission: {
      recurso: "boletim",
      acao: "read",
      escopo: "global",
    },
  },
  {
    label: "Unidades",
    href: "/unidades",
    icon: Building2,
    permission: {
      recurso: "unidades",
      acao: "manage",
      escopo: "global",
    },
  },
  {
    label: "Servidores",
    href: "/servidores",
    icon: Users,
    permission: {
      recurso: "servidores",
      acao: "manage",
      escopo: "global",
    },
  },
  {
    label: "Jornadas",
    href: "/jornadas",
    icon: Clock,
    permission: {
      recurso: "jornadas",
      acao: "manage",
      escopo: "global",
    },
  },
  {
    label: "Relatórios",
    href: "/relatorios",
    icon: BarChart3,
    permission: {
      recurso: "relatorios",
      acao: "read",
      escopo: "global",
    },
  },
  {
    label: "Auditoria",
    href: "/auditoria",
    icon: History,
    permission: {
      recurso: "auditoria",
      acao: "read",
      escopo: "global",
    },
  },
  {
    label: "RBAC",
    href: "/admin/rbac",
    icon: LockKeyhole,
    permission: {
      recurso: "perfis",
      acao: "manage",
      escopo: "global",
    },
  },
  {
    label: "Administração",
    href: "/admin",
    icon: Settings,
    permission: {
      recurso: "configuracoes",
      acao: "manage",
      escopo: "global",
    },
  },
  {
    label: "Equipamentos Biométricos",
    href: "/biometria/equipamentos",
    icon: Clock,
    permission: {
      recurso: "equipamentos",
      acao: "manage",
      escopo: "global",
    },
  },
];
