import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { TipoMarcacao } from "@prisma-generated/client";
import { recalcularEspelhoDiarioService } from "@/modules/espelho/services/recalcular-espelho-diario-service";
import { recalcularBancoHorasMensalService } from "@/modules/banco-horas/services/recalcular-banco-horas-service";
import { normalizeCpf, isValidCpfFormat } from "@/shared/utils/cpf";
import { ZodError } from "zod";
import { biometriaMarcacaoSchema } from "@/shared/validators/biometria.schema";

function inicioDoDia(data: Date) {
  return new Date(data.getFullYear(), data.getMonth(), data.getDate());
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = request.headers.get("x-api-key");

    if (!apiKey || apiKey !== process.env.BIOMETRIA_API_KEY) {
      console.log("Api Key: ", apiKey, ".env: ", process.env.BIOMETRIA_API_KEY);
      return NextResponse.json(
        { ok: false, message: "Não autorizado." },
        { status: 401 },
      );
    }

    const body = await request.json();
    const parsed = biometriaMarcacaoSchema.parse(body);

    const { codigoEquipamento, cpf, tipo, dataHora } = parsed;

    if (!codigoEquipamento || !cpf || !tipo || !dataHora) {
      return NextResponse.json(
        {
          ok: false,
          message: "Informe codigoEquipamento, cpf, tipo e dataHora.",
        },
        { status: 400 },
      );
    }

    const cpfNormalizado = normalizeCpf(cpf);

    if (!isValidCpfFormat(cpfNormalizado)) {
      return NextResponse.json(
        {
          ok: false,
          message: "CPF inválido.",
        },
        { status: 400 },
      );
    }

    const equipamento = await prisma.equipamentoPonto.findUnique({
      where: { codigo: codigoEquipamento },
    });

    if (!equipamento) {
      return NextResponse.json(
        { ok: false, message: "Equipamento não cadastrado." },
        { status: 404 },
      );
    }

    const servidor = await prisma.servidor.findUnique({
      where: { cpf: cpfNormalizado },
    });

    if (!servidor) {
      return NextResponse.json(
        { ok: false, message: "Servidor não encontrado." },
        { status: 404 },
      );
    }

    const dataMarcacao = new Date(dataHora);

    const marcacao = await prisma.marcacaoPonto.create({
      data: {
        servidorId: servidor.id,
        equipamentoId: equipamento.id,
        tipo,
        origem: "BIOMETRICA",
        status: "VALIDA",
        dataHora: dataMarcacao,
        dataReferencia: inicioDoDia(dataMarcacao),
        justificativa: "Marcação recebida por integração biométrica.",
      },
    });

    await prisma.auditoria.create({
      data: {
        tipoEvento: "IMPORT",
        entidade: "MarcacaoPonto",
        entidadeId: marcacao.id,
        descricao: "Marcação biométrica recebida por API.",
        payloadDepois: {
          codigoEquipamento,
          cpf: cpfNormalizado.replace(/^(\d{3})\d{5}(\d{3})$/, "$1*****$2"),
          matricula: servidor.matricula,
          tipo,
          dataHora,
          marcacaoId: marcacao.id,
        },
      },
    });

    const espelho = await recalcularEspelhoDiarioService({
      servidorId: servidor.id,
      data: dataMarcacao,
      origem: "BIOMETRIA_API",
    });

    await recalcularBancoHorasMensalService({
      servidorId: servidor.id,
      ano: espelho.dataReferencia.getFullYear(),
      mes: espelho.dataReferencia.getMonth() + 1,
      origem: "BIOMETRIA_API_AFTER_ESPELHO",
    });

    return NextResponse.json({
      ok: true,
      marcacaoId: marcacao.id,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          ok: false,
          message: "Dados inválidos.",
          issues: error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        ok: false,
        message:
          error instanceof Error
            ? error.message
            : "Erro inesperado ao receber marcação.",
      },
      { status: 500 },
    );
  }
}
