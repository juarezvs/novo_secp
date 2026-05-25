"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/shared/lib/prisma";

export async function gerarHomologacaoMensal(
  unidadeId: string,
  ano: number,
  mes: number,
) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Usuário não autenticado.");
  }

  const servidores = await prisma.servidor.findMany({
    where: {
      ativo: true,
      lotacoes: {
        some: {
          unidadeId,
          ativa: true,
        },
      },
    },
  });

  const homologacao = await prisma.$transaction(async (tx) => {
    const homologacao = await tx.homologacaoMensal.upsert({
      where: {
        unidadeId_ano_mes: {
          unidadeId,
          ano,
          mes,
        },
      },
      update: {
        status: "COM_PENDENCIAS",
      },
      create: {
        unidadeId,
        ano,
        mes,
        status: "COM_PENDENCIAS",
      },
    });

    for (const servidor of servidores) {
      const pendencias = await tx.espelhoDiario.count({
        where: {
          servidorId: servidor.id,
          dataReferencia: {
            gte: new Date(ano, mes - 1, 1),
            lte: new Date(ano, mes, 0, 23, 59, 59, 999),
          },
          possuiInconsistencia: true,
        },
      });

      await tx.homologacaoMensalServidor.upsert({
        where: {
          homologacaoId_servidorId: {
            homologacaoId: homologacao.id,
            servidorId: servidor.id,
          },
        },
        update: {
          possuiPendencia: pendencias > 0,
          homologado: pendencias === 0,
        },
        create: {
          homologacaoId: homologacao.id,
          servidorId: servidor.id,
          possuiPendencia: pendencias > 0,
          homologado: pendencias === 0,
        },
      });
    }

    await tx.auditoria.create({
      data: {
        usuarioId: session.user.id,
        tipoEvento: "CREATE",
        entidade: "HomologacaoMensal",
        entidadeId: homologacao.id,
        descricao: `Homologação mensal gerada para ${mes}/${ano}.`,
        payloadDepois: {
          unidadeId,
          ano,
          mes,
          quantidadeServidores: servidores.length,
        },
        perfilAtivo: session.user.activeProfileId,
      },
    });

    return homologacao;
  });

  revalidatePath("/homologacao");

  return homologacao;
}
