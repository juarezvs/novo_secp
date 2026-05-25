import { prisma } from "@/shared/lib/prisma";
import { TipoEventoAuditoria } from "@prisma-generated/client";

type Params = {
  tipoEvento?: string;
  entidade?: string;
  usuario?: string;
};

export async function getAuditorias(params: Params = {}) {
  return prisma.auditoria.findMany({
    where: {
      tipoEvento: params.tipoEvento
        ? (params.tipoEvento as TipoEventoAuditoria)
        : undefined,
      entidade: params.entidade || undefined,
      usuario: params.usuario
        ? {
            OR: [
              { nome: { contains: params.usuario, mode: "insensitive" } },
              { login: { contains: params.usuario, mode: "insensitive" } },
              { email: { contains: params.usuario, mode: "insensitive" } },
            ],
          }
        : undefined,
    },
    orderBy: {
      criadoEm: "desc",
    },
    take: 100,
    include: {
      usuario: true,
    },
  });
}
