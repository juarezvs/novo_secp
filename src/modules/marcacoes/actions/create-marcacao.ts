"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/shared/lib/prisma";
import { getServidorByUserId } from "@/modules/servidores/queries/get-servidor-by-user";
import { OrigemMarcacao, TipoMarcacao } from "@prisma-generated/client";
import { recalcularEspelhoDiario } from "@/modules/espelho/actions/recalcular-espelho-diario";

function inicioDoDia(data: Date) {
  return new Date(data.getFullYear(), data.getMonth(), data.getDate());
}

export async function createMarcacao(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Usuário não autenticado.");
  }

  const servidor = await getServidorByUserId(session.user.id);

  if (!servidor) {
    throw new Error("Usuário autenticado não possui servidor vinculado.");
  }

  const tipo = String(formData.get("tipo") ?? "") as TipoMarcacao;
  const latitudeRaw = String(formData.get("latitude") ?? "");
  const longitudeRaw = String(formData.get("longitude") ?? "");

  if (!tipo) {
    throw new Error("Tipo de marcação não informado.");
  }

  const agora = new Date();

  const marcacao = await prisma.marcacaoPonto.create({
    data: {
      servidorId: servidor.id,
      tipo,
      origem: OrigemMarcacao.TOTEM,
      status: "VALIDA",
      dataHora: agora,
      dataReferencia: inicioDoDia(agora),
      latitude: latitudeRaw ? Number(latitudeRaw) : undefined,
      longitude: longitudeRaw ? Number(longitudeRaw) : undefined,
      justificativa: "Registro realizado pelo painel web do SECP.",
    },
  });

  await prisma.auditoria.create({
    data: {
      usuarioId: session.user.id,
      tipoEvento: "CREATE",
      entidade: "MarcacaoPonto",
      entidadeId: marcacao.id,
      descricao: `Registro de ponto realizado: ${tipo}.`,
      payloadDepois: {
        id: marcacao.id,
        tipo,
        dataHora: marcacao.dataHora,
        origem: marcacao.origem,
        servidorId: servidor.id,
      },
      perfilAtivo: session.user.activeProfileId,
    },
  });

  await recalcularEspelhoDiario(servidor.id, agora);

  revalidatePath("/ponto");
  revalidatePath("/espelho");
}
