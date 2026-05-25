import "dotenv/config";
import { PrismaClient, TipoPerfilSistema } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const login = "am200401"; // troque pelo seu login AD, se for outro
  const unidadeSigla = "NUTEC"; // troque pela unidade onde você será chefia

  const usuario = await prisma.usuario.findUnique({
    where: {
      login,
    },
  });

  if (!usuario) {
    throw new Error(`Usuário com login ${login} não encontrado.`);
  }

  const unidade = await prisma.unidadeOrganizacional.findFirst({
    where: {
      sigla: unidadeSigla,
    },
  });

  if (!unidade) {
    throw new Error(`Unidade ${unidadeSigla} não encontrada.`);
  }

  const perfilChefia = await prisma.perfil.upsert({
    where: {
      nome: "Chefia",
    },
    update: {
      tipo: TipoPerfilSistema.GESTOR,
      ativo: true,
    },
    create: {
      nome: "Chefia",
      tipo: TipoPerfilSistema.GESTOR,
      ativo: true,
    },
  });

  const usuarioPerfil = await prisma.usuarioPerfil.upsert({
    where: {
      usuarioId_perfilId_unidadeId: {
        usuarioId: usuario.id,
        perfilId: perfilChefia.id,
        unidadeId: unidade.id,
      },
    },
    update: {
      ativo: true,
    },
    create: {
      usuarioId: usuario.id,
      perfilId: perfilChefia.id,
      unidadeId: unidade.id,
      ativo: true,
    },
  });

  await prisma.usuario.update({
    where: {
      id: usuario.id,
    },
    data: {
      perfilAtivoId: usuarioPerfil.id,
    },
  });

  console.log("Perfil de chefia atribuído com sucesso:");
  console.log({
    usuario: usuario.nome,
    login: usuario.login,
    perfil: perfilChefia.nome,
    tipo: perfilChefia.tipo,
    unidade: unidade.sigla,
  });
}

main()
  .catch((error) => {
    console.error("Erro ao atribuir perfil de chefia:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
