import "dotenv/config";
import { PrismaClient } from "@prisma-generated/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const matricula = "am200401"; // troque pela matrícula do servidor
  const nomeJornada = "Jornada ordinária de 7 horas";

  const servidor = await prisma.servidor.findUnique({
    where: {
      matricula,
    },
    select: {
      id: true,
      matricula: true,
      nomeFuncional: true,
      ativo: true,
    },
  });

  if (!servidor || !servidor.ativo) {
    throw new Error(`Servidor ${matricula} não encontrado ou inativo.`);
  }

  const jornada = await prisma.jornada.findFirst({
    where: {
      nome: nomeJornada,
      ativa: true,
    },
    select: {
      id: true,
      nome: true,
      cargaMinutosDia: true,
      ativa: true,
    },
  });

  if (!jornada) {
    throw new Error(`Jornada "${nomeJornada}" não encontrada ou inativa.`);
  }

  await prisma.$transaction(async (tx) => {
    await tx.jornadaServidor.updateMany({
      where: {
        servidorId: servidor.id,
        ativa: true,
      },
      data: {
        ativa: false,
        fimEm: new Date(),
      },
    });

    const novaJornadaServidor = await tx.jornadaServidor.create({
      data: {
        servidorId: servidor.id,
        jornadaId: jornada.id,
        inicioEm: new Date(),
        ativa: true,
      },
    });

    console.log("Jornada atribuída com sucesso:", {
      servidor: servidor.nomeFuncional,
      matricula: servidor.matricula,
      jornada: jornada.nome,
      jornadaServidorId: novaJornadaServidor.id,
    });
  });
}

main()
  .catch((error) => {
    console.error("Erro ao atribuir jornada:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
