"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/shared/lib/prisma";
import { requirePermission } from "@/lib/auth/permissions";
import { normalizeCpf, isValidCpfFormat } from "@/shared/utils/cpf";
import { createServidorSchema } from "@/shared/validators/servidor.schema";
import type { ActionState } from "@/shared/actions/action-state";
import { actionFailure, actionSuccess } from "@/shared/actions/action-response";
import { formDataToObject } from "@/shared/validators/form-data";

export async function createServidor(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    await requirePermission({
      recurso: "servidores",
      acao: "manage",
      escopo: "global",
    });

    const {
      nome,
      login,
      email,
      matricula,
      cpf,
      cargo,
      funcao,
      unidadeId,
      jornadaId,
    } = createServidorSchema.parse(formDataToObject(formData));
    await prisma.$transaction(async (tx) => {
      const unidade = await tx.unidadeOrganizacional.findUnique({
        where: {
          id: unidadeId,
        },
        select: {
          id: true,
        },
      });

      if (!unidade) {
        throw new Error("Unidade de lotação inválida.");
      }

      const jornada = await tx.jornada.findUnique({
        where: {
          id: jornadaId,
        },
        select: {
          id: true,
        },
      });

      if (!jornada) {
        throw new Error("Jornada inválida.");
      }

      const usuario = await tx.usuario.upsert({
        where: {
          login,
        },
        update: {
          nome,
          email: email || null,
          matricula,
          ativo: true,
        },
        create: {
          nome,
          login,
          email: email || null,
          matricula,
          ativo: true,
        },
      });

      const servidor = await tx.servidor.upsert({
        where: {
          matricula,
        },
        update: {
          usuarioId: usuario.id,
          cpf,
          nomeFuncional: nome,
          cargo: cargo || null,
          funcao: funcao || null,
          emailFuncional: email || null,
          ativo: true,
        },
        create: {
          usuarioId: usuario.id,
          matricula,
          cpf,
          nomeFuncional: nome,
          cargo: cargo || null,
          funcao: funcao || null,
          emailFuncional: email || null,
          ativo: true,
        },
      });

      const lotacaoAtual = await tx.lotacaoServidor.findFirst({
        where: {
          servidorId: servidor.id,
          principal: true,
          ativa: true,
        },
        select: {
          id: true,
          unidadeId: true,
        },
      });

      if (!lotacaoAtual || lotacaoAtual.unidadeId !== unidadeId) {
        await tx.lotacaoServidor.updateMany({
          where: {
            servidorId: servidor.id,
            principal: true,
            ativa: true,
          },
          data: {
            ativa: false,
          },
        });

        await tx.lotacaoServidor.create({
          data: {
            servidorId: servidor.id,
            unidadeId,
            principal: true,
            inicioEm: new Date(),
            ativa: true,
          },
        });
      }

      const jornadaAtual = await tx.jornadaServidor.findFirst({
        where: {
          servidorId: servidor.id,
          ativa: true,
        },
        select: {
          id: true,
          jornadaId: true,
        },
      });

      if (!jornadaAtual || jornadaAtual.jornadaId !== jornadaId) {
        await tx.jornadaServidor.updateMany({
          where: {
            servidorId: servidor.id,
            ativa: true,
          },
          data: {
            ativa: false,
          },
        });

        await tx.jornadaServidor.create({
          data: {
            servidorId: servidor.id,
            jornadaId,
            inicioEm: new Date(),
            ativa: true,
          },
        });
      }

      const perfilServidor = await tx.perfil.findFirst({
        where: {
          nome: "Servidor",
        },
        select: {
          id: true,
        },
      });

      if (perfilServidor) {
        await tx.usuarioPerfil.upsert({
          where: {
            usuarioId_perfilId_unidadeId: {
              usuarioId: usuario.id,
              perfilId: perfilServidor.id,
              unidadeId,
            },
          },
          update: {
            ativo: true,
          },
          create: {
            usuarioId: usuario.id,
            perfilId: perfilServidor.id,
            unidadeId,
            ativo: true,
          },
        });
      }

      await tx.auditoria.create({
        data: {
          usuarioId: operadorUsuarioId,
          tipoEvento: "CREATE",
          entidade: "Servidor",
          entidadeId: servidor.id,
          descricao: `Servidor ${matricula} criado/atualizado.`,
          payloadDepois: {
            servidorId: servidor.id,
            usuarioId: usuario.id,
            matricula,
            cpf: cpf.replace(/^(\d{3})\d{5}(\d{3})$/, "$1*****$2"),
            nome,
            login,
            email: email || null,
            unidadeId,
            jornadaId,
          },
        },
      });
    });

    revalidatePath("/servidores");
    // redirect("/servidores");
    return actionSuccess("Servidor cadastrado com sucesso.");
  } catch (error) {
    return actionFailure(error);
  }
}
