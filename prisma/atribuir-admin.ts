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
  const login = "am200401";
  const unidadeSigla = "SJAM";

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

  let perfilAdmin = await prisma.perfil.findFirst({
    where: {
      OR: [{ nome: "Admin" }, { nome: "Administrador" }],
    },
  });

  if (!perfilAdmin) {
    perfilAdmin = await prisma.perfil.create({
      data: {
        nome: "Admin",
        tipo: TipoPerfilSistema.ADMIN,
        ativo: true,
      },
    });
  } else {
    perfilAdmin = await prisma.perfil.update({
      where: {
        id: perfilAdmin.id,
      },
      data: {
        tipo: TipoPerfilSistema.ADMIN,
        ativo: true,
      },
    });
  }

  const usuarioPerfil = await prisma.usuarioPerfil.upsert({
    where: {
      usuarioId_perfilId_unidadeId: {
        usuarioId: usuario.id,
        perfilId: perfilAdmin.id,
        unidadeId: unidade.id,
      },
    },
    update: {
      ativo: true,
    },
    create: {
      usuarioId: usuario.id,
      perfilId: perfilAdmin.id,
      unidadeId: unidade.id,
      ativo: true,
    },
  });

  /**
   * Se o seu model Usuario possuir perfilAtivoId apontando para UsuarioPerfil,
   * este bloco define o perfil ADMIN como perfil ativo.
   *
   * Se der erro aqui, veja a observação abaixo.
   */
  await prisma.usuario.update({
    where: {
      id: usuario.id,
    },
    data: {
      perfilAtivoId: usuarioPerfil.id,
    },
  });

  console.log("Perfil ADMIN atribuído com sucesso.");
  console.log({
    usuario: usuario.nome,
    login: usuario.login,
    perfil: perfilAdmin.nome,
    tipo: perfilAdmin.tipo,
    unidade: unidade.sigla,
    usuarioPerfilId: usuarioPerfil.id,
  });
}

main()
  .catch((error) => {
    console.error("Erro ao atribuir perfil ADMIN:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
