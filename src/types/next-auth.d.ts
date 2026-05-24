import type { TipoPerfilSistema } from "@prisma/client";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      activeProfileId: string | null;
      perfis: Array<{
        id: string;
        nome: string;
        tipo: TipoPerfilSistema;
        unidadeId: string | null;
        unidadeSigla: string | null;
      }>;
    } & DefaultSession["user"];
  }
}
