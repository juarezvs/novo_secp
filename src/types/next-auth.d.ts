import { TipoPerfilSistema } from "@prisma-generated/client";
import type { DefaultSession } from "next-auth";

type SessionPerfil = {
  id: string;
  nome: string;
  tipo: TipoPerfilSistema;
  unidadeId: string | null;
  unidadeSigla: string | null;
};

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      activeProfileId: string | null;
      perfis: SessionPerfil[];
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    usuarioId?: string;
  }
}
