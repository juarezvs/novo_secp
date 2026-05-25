import "dotenv/config";
import {
  PrismaClient,
  TipoJornada,
  TipoPerfilSistema,
} from "@prisma-generated/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL não encontrada no arquivo .env");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("Iniciando seed do SECP...");

  /**
   * =========================
   * PERFIS
   * =========================
   */

  const perfis = [
    {
      nome: "Servidor",
      descricao:
        "Perfil básico para servidores registrarem ponto e acompanharem frequência.",
      tipo: TipoPerfilSistema.SERVIDOR,
    },
    {
      nome: "Gestor / Chefia Imediata",
      descricao:
        "Perfil responsável por aprovar solicitações e homologar frequência.",
      tipo: TipoPerfilSistema.GESTOR,
    },
    {
      nome: "Delegado da Chefia",
      descricao: "Perfil com competências delegadas pela chefia imediata.",
      tipo: TipoPerfilSistema.DELEGADO_CHEFIA,
    },
    {
      nome: "Administrador do Sistema",
      descricao: "Perfil com acesso administrativo global.",
      tipo: TipoPerfilSistema.ADMIN,
    },
    {
      nome: "NUTEC",
      descricao:
        "Perfil técnico responsável por usuários, jornadas, equipamentos e suporte.",
      tipo: TipoPerfilSistema.NUTEC,
    },
    {
      nome: "SECAP / NUCGP",
      descricao:
        "Perfil responsável por receber boletins e acompanhar pendências funcionais.",
      tipo: TipoPerfilSistema.SECAP_NUCGP,
    },
    {
      nome: "SECAD",
      descricao: "Perfil administrativo para acompanhamento institucional.",
      tipo: TipoPerfilSistema.SECAD,
    },
    {
      nome: "DIREF",
      descricao:
        "Perfil de autoridade superior para autorizações excepcionais.",
      tipo: TipoPerfilSistema.DIREF,
    },
    {
      nome: "Auditor / Consulta",
      descricao: "Perfil somente leitura para auditoria e consultas.",
      tipo: TipoPerfilSistema.AUDITOR,
    },
  ];

  for (const perfil of perfis) {
    await prisma.perfil.upsert({
      where: { nome: perfil.nome },
      update: perfil,
      create: perfil,
    });
  }

  /**
   * =========================
   * PERMISSÕES
   * =========================
   */

  const permissoes = [
    ["dashboard", "read", "self", "Visualizar dashboard próprio"],
    ["ponto", "create", "self", "Registrar ponto próprio"],
    ["espelho", "read", "self", "Consultar espelho próprio"],
    ["banco-horas", "read", "self", "Consultar banco de horas próprio"],
    ["solicitacao", "create", "self", "Criar solicitação própria"],

    ["equipe", "read", "subordinados", "Visualizar equipe subordinada"],
    ["espelho", "read", "subordinados", "Consultar espelho dos subordinados"],
    [
      "solicitacao",
      "approve",
      "subordinados",
      "Aprovar solicitações dos subordinados",
    ],
    ["homologacao", "close", "unidade", "Homologar frequência da unidade"],
    ["boletim", "generate", "unidade", "Gerar boletim da unidade"],
    ["boletim", "send", "unidade", "Enviar boletim à SECAP/NUCGP"],

    ["usuarios", "manage", "global", "Gerenciar usuários"],
    ["perfis", "manage", "global", "Gerenciar perfis"],
    ["permissoes", "manage", "global", "Gerenciar permissões"],
    ["unidades", "manage", "global", "Gerenciar unidades organizacionais"],
    ["servidores", "manage", "global", "Gerenciar servidores"],
    ["jornadas", "manage", "global", "Gerenciar jornadas"],
    ["equipamentos", "manage", "global", "Gerenciar equipamentos biométricos"],

    ["boletim", "read", "global", "Consultar boletins de frequência"],
    ["auditoria", "read", "global", "Consultar auditoria"],
    ["relatorios", "read", "global", "Consultar relatórios"],
    ["configuracoes", "manage", "global", "Gerenciar configurações do sistema"],
  ] as const;

  for (const [recurso, acao, escopo, descricao] of permissoes) {
    await prisma.permissao.upsert({
      where: {
        recurso_acao_escopo: {
          recurso,
          acao,
          escopo,
        },
      },
      update: { descricao, ativo: true },
      create: {
        recurso,
        acao,
        escopo,
        descricao,
      },
    });
  }

  /**
   * =========================
   * VÍNCULO PERFIL → PERMISSÕES
   * =========================
   */

  const vincularPermissoes = async (
    nomePerfil: string,
    regras: Array<[string, string, string]>,
  ) => {
    const perfil = await prisma.perfil.findUniqueOrThrow({
      where: { nome: nomePerfil },
    });

    for (const [recurso, acao, escopo] of regras) {
      const permissao = await prisma.permissao.findUniqueOrThrow({
        where: {
          recurso_acao_escopo: {
            recurso,
            acao,
            escopo,
          },
        },
      });

      await prisma.perfilPermissao.upsert({
        where: {
          perfilId_permissaoId: {
            perfilId: perfil.id,
            permissaoId: permissao.id,
          },
        },
        update: {},
        create: {
          perfilId: perfil.id,
          permissaoId: permissao.id,
        },
      });
    }
  };

  await vincularPermissoes("Servidor", [
    ["dashboard", "read", "self"],
    ["ponto", "create", "self"],
    ["espelho", "read", "self"],
    ["banco-horas", "read", "self"],
    ["solicitacao", "create", "self"],
  ]);

  await vincularPermissoes("Gestor / Chefia Imediata", [
    ["dashboard", "read", "self"],
    ["espelho", "read", "self"],
    ["banco-horas", "read", "self"],
    ["solicitacao", "create", "self"],
    ["equipe", "read", "subordinados"],
    ["espelho", "read", "subordinados"],
    ["solicitacao", "approve", "subordinados"],
    ["homologacao", "close", "unidade"],
    ["boletim", "generate", "unidade"],
    ["boletim", "send", "unidade"],
  ]);

  await vincularPermissoes("Delegado da Chefia", [
    ["equipe", "read", "subordinados"],
    ["espelho", "read", "subordinados"],
    ["solicitacao", "approve", "subordinados"],
    ["homologacao", "close", "unidade"],
    ["boletim", "generate", "unidade"],
  ]);

  await vincularPermissoes(
    "Administrador do Sistema",
    permissoes.map(([recurso, acao, escopo]) => [recurso, acao, escopo]),
  );

  await vincularPermissoes("NUTEC", [
    ["usuarios", "manage", "global"],
    ["unidades", "manage", "global"],
    ["servidores", "manage", "global"],
    ["jornadas", "manage", "global"],
    ["equipamentos", "manage", "global"],
    ["auditoria", "read", "global"],
    ["relatorios", "read", "global"],
  ]);

  await vincularPermissoes("SECAP / NUCGP", [
    ["boletim", "read", "global"],
    ["relatorios", "read", "global"],
    ["auditoria", "read", "global"],
  ]);

  await vincularPermissoes("SECAD", [
    ["relatorios", "read", "global"],
    ["auditoria", "read", "global"],
  ]);

  await vincularPermissoes("DIREF", [
    ["relatorios", "read", "global"],
    ["auditoria", "read", "global"],
    ["boletim", "read", "global"],
  ]);

  await vincularPermissoes("Auditor / Consulta", [
    ["relatorios", "read", "global"],
    ["auditoria", "read", "global"],
    ["boletim", "read", "global"],
  ]);

  /**
   * =========================
   * ÓRGÃO E UNIDADES
   * =========================
   */

  const orgao = await prisma.orgao.upsert({
    where: { sigla: "JFAM" },
    update: {
      nome: "Justiça Federal de Primeiro Grau no Amazonas",
      ativo: true,
    },
    create: {
      sigla: "JFAM",
      nome: "Justiça Federal de Primeiro Grau no Amazonas",
      descricao: "Seção Judiciária do Amazonas",
    },
  });

  const sjam = await prisma.unidadeOrganizacional.upsert({
    where: {
      orgaoId_sigla: {
        orgaoId: orgao.id,
        sigla: "SJAM",
      },
    },
    update: {
      nome: "Seção Judiciária do Amazonas",
      tipo: "SECAO_JUDICIARIA",
      ativa: true,
    },
    create: {
      orgaoId: orgao.id,
      sigla: "SJAM",
      nome: "Seção Judiciária do Amazonas",
      tipo: "SECAO_JUDICIARIA",
    },
  });

  const unidades = [
    {
      sigla: "NUTEC",
      nome: "Núcleo de Tecnologia da Informação",
      tipo: "NUCLEO",
      unidadePaiId: sjam.id,
    },
    {
      sigla: "SECAP",
      nome: "Seção de Cadastro de Pessoal",
      tipo: "SECAO",
      unidadePaiId: sjam.id,
    },
    {
      sigla: "NUCGP",
      nome: "Núcleo de Gestão de Pessoas",
      tipo: "NUCLEO",
      unidadePaiId: sjam.id,
    },
    {
      sigla: "SECAD",
      nome: "Secretaria Administrativa",
      tipo: "SECRETARIA",
      unidadePaiId: sjam.id,
    },
    {
      sigla: "DIREF",
      nome: "Diretoria do Foro",
      tipo: "DIRETORIA",
      unidadePaiId: sjam.id,
    },
    {
      sigla: "SSJTBT",
      nome: "Subseção Judiciária de Tabatinga",
      tipo: "SUBSECAO_JUDICIARIA",
      unidadePaiId: sjam.id,
    },
    {
      sigla: "UAA-TFE",
      nome: "Unidade Avançada de Atendimento de Tefé",
      tipo: "UNIDADE_AVANCADA",
      unidadePaiId: sjam.id,
    },
  ];

  for (const unidade of unidades) {
    await prisma.unidadeOrganizacional.upsert({
      where: {
        orgaoId_sigla: {
          orgaoId: orgao.id,
          sigla: unidade.sigla,
        },
      },
      update: {
        nome: unidade.nome,
        tipo: unidade.tipo,
        unidadePaiId: unidade.unidadePaiId,
        ativa: true,
      },
      create: {
        orgaoId: orgao.id,
        sigla: unidade.sigla,
        nome: unidade.nome,
        tipo: unidade.tipo,
        unidadePaiId: unidade.unidadePaiId,
      },
    });
  }

  /**
   * =========================
   * JORNADAS PADRÃO
   * =========================
   */

  const jornada7h = await prisma.jornada.upsert({
    where: { nome: "Jornada ordinária de 7 horas" },
    update: {
      tipo: TipoJornada.SETE_HORAS,
      cargaMinutosDia: 420,
      exigeIntervalo: false,
      ativa: true,
    },
    create: {
      nome: "Jornada ordinária de 7 horas",
      tipo: TipoJornada.SETE_HORAS,
      cargaMinutosDia: 420,
      exigeIntervalo: false,
      horarioInicioPadrao: "08:00",
      horarioFimPadrao: "15:00",
    },
  });

  const jornada8h = await prisma.jornada.upsert({
    where: { nome: "Jornada ordinária de 8 horas com intervalo" },
    update: {
      tipo: TipoJornada.OITO_HORAS,
      cargaMinutosDia: 480,
      exigeIntervalo: true,
      intervaloMinMinutos: 60,
      intervaloMaxMinutos: 180,
      ativa: true,
    },
    create: {
      nome: "Jornada ordinária de 8 horas com intervalo",
      tipo: TipoJornada.OITO_HORAS,
      cargaMinutosDia: 480,
      exigeIntervalo: true,
      intervaloMinMinutos: 60,
      intervaloMaxMinutos: 180,
      horarioInicioPadrao: "08:00",
      horarioFimPadrao: "17:00",
    },
  });

  const jornadaTeletrabalho = await prisma.jornada.upsert({
    where: { nome: "Teletrabalho" },
    update: {
      tipo: TipoJornada.TELETRABALHO,
      cargaMinutosDia: 420,
      exigeIntervalo: false,
      ativa: true,
    },
    create: {
      nome: "Teletrabalho",
      tipo: TipoJornada.TELETRABALHO,
      cargaMinutosDia: 420,
      exigeIntervalo: false,
    },
  });

  const jornadaPlantao = await prisma.jornada.upsert({
    where: { nome: "Plantão / Recesso Forense" },
    update: {
      tipo: TipoJornada.PLANTAO,
      cargaMinutosDia: 420,
      exigeIntervalo: false,
      ativa: true,
    },
    create: {
      nome: "Plantão / Recesso Forense",
      tipo: TipoJornada.PLANTAO,
      cargaMinutosDia: 420,
      exigeIntervalo: false,
    },
  });

  /**
   * Vincula jornada padrão de 7h à SJAM.
   */
  await prisma.jornadaUnidade.upsert({
    where: {
      jornadaId_unidadeId_inicioEm: {
        jornadaId: jornada7h.id,
        unidadeId: sjam.id,
        inicioEm: new Date("2025-08-01T00:00:00.000Z"),
      },
    },
    update: {
      ativa: true,
    },
    create: {
      jornadaId: jornada7h.id,
      unidadeId: sjam.id,
      inicioEm: new Date("2025-08-01T00:00:00.000Z"),
      ativa: true,
    },
  });

  /**
   * =========================
   * CALENDÁRIO BASE
   * =========================
   */

  const calendario2025 = await prisma.calendario.upsert({
    where: {
      nome_ano: {
        nome: "Calendário Institucional JFAM 2025",
        ano: 2025,
      },
    },
    update: {
      ativo: true,
    },
    create: {
      nome: "Calendário Institucional JFAM 2025",
      ano: 2025,
      ativo: true,
    },
  });

  await prisma.feriado.createMany({
    data: [
      {
        calendarioId: calendario2025.id,
        data: new Date("2025-01-01T00:00:00.000Z"),
        nome: "Confraternização Universal",
        recorrente: true,
      },
      {
        calendarioId: calendario2025.id,
        data: new Date("2025-04-21T00:00:00.000Z"),
        nome: "Tiradentes",
        recorrente: true,
      },
      {
        calendarioId: calendario2025.id,
        data: new Date("2025-05-01T00:00:00.000Z"),
        nome: "Dia do Trabalhador",
        recorrente: true,
      },
      {
        calendarioId: calendario2025.id,
        data: new Date("2025-09-07T00:00:00.000Z"),
        nome: "Independência do Brasil",
        recorrente: true,
      },
      {
        calendarioId: calendario2025.id,
        data: new Date("2025-10-12T00:00:00.000Z"),
        nome: "Nossa Senhora Aparecida",
        recorrente: true,
      },
      {
        calendarioId: calendario2025.id,
        data: new Date("2025-11-02T00:00:00.000Z"),
        nome: "Finados",
        recorrente: true,
      },
      {
        calendarioId: calendario2025.id,
        data: new Date("2025-11-15T00:00:00.000Z"),
        nome: "Proclamação da República",
        recorrente: true,
      },
      {
        calendarioId: calendario2025.id,
        data: new Date("2025-12-25T00:00:00.000Z"),
        nome: "Natal",
        recorrente: true,
      },
    ],
    skipDuplicates: true,
  });

  /**
   * =========================
   * USUÁRIO ADMIN INICIAL
   * =========================
   */

  const admin = await prisma.usuario.upsert({
    where: { login: "admin.secp" },
    update: {
      nome: "Administrador SECP",
      ativo: true,
    },
    create: {
      nome: "Administrador SECP",
      login: "admin.secp",
      email: "admin.secp@jfam.jus.br",
      matricula: "000000",
      ativo: true,
    },
  });

  const perfilAdmin = await prisma.perfil.findUniqueOrThrow({
    where: { nome: "Administrador do Sistema" },
  });

  await prisma.usuarioPerfil.upsert({
    where: {
      usuarioId_perfilId_unidadeId: {
        usuarioId: admin.id,
        perfilId: perfilAdmin.id,
        unidadeId: sjam.id,
      },
    },
    update: {
      ativo: true,
    },
    create: {
      usuarioId: admin.id,
      perfilId: perfilAdmin.id,
      unidadeId: sjam.id,
      ativo: true,
    },
  });

  console.log("Seed finalizado com sucesso.");
}

main()
  .then(async () => {
    console.log("Seed executado com sucesso.");
  })
  .catch(async (error) => {
    console.error("Erro ao executar seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
