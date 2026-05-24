-- CreateEnum
CREATE TYPE "StatusRegistro" AS ENUM ('ATIVO', 'INATIVO', 'EXCLUIDO');

-- CreateEnum
CREATE TYPE "TipoPerfilSistema" AS ENUM ('SERVIDOR', 'GESTOR', 'DELEGADO_CHEFIA', 'ADMIN', 'NUTEC', 'SECAP_NUCGP', 'SECAD', 'DIREF', 'AUDITOR', 'CUSTOMIZADO');

-- CreateEnum
CREATE TYPE "TipoJornada" AS ENUM ('SETE_HORAS', 'OITO_HORAS', 'ESPECIAL', 'PLANTAO', 'TELETRABALHO');

-- CreateEnum
CREATE TYPE "TipoMarcacao" AS ENUM ('ENTRADA', 'SAIDA_INTERVALO', 'RETORNO_INTERVALO', 'SAIDA', 'MANUAL', 'AJUSTADA');

-- CreateEnum
CREATE TYPE "OrigemMarcacao" AS ENUM ('BIOMETRICA', 'MANUAL', 'IMPORTADA', 'API', 'TOTEM', 'MEIO_ALTERNATIVO');

-- CreateEnum
CREATE TYPE "StatusMarcacao" AS ENUM ('VALIDA', 'PENDENTE', 'AJUSTADA', 'INVALIDADA', 'INCONSISTENTE');

-- CreateEnum
CREATE TYPE "TipoMovimentoBancoHoras" AS ENUM ('CREDITO', 'DEBITO', 'COMPENSACAO_CREDITO', 'COMPENSACAO_DEBITO', 'EXPIRACAO', 'AJUSTE_MANUAL', 'DESCONTO');

-- CreateEnum
CREATE TYPE "StatusSolicitacao" AS ENUM ('RASCUNHO', 'ENVIADA', 'EM_ANALISE', 'APROVADA', 'INDEFERIDA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "TipoSolicitacao" AS ENUM ('AJUSTE_PONTO', 'COMPENSACAO', 'ABONO', 'ATIVIDADE_EXTERNA', 'VIAGEM_SERVICO', 'CAPACITACAO', 'TELETRABALHO', 'PLANTAO', 'RECESSO_FORENSE', 'DISPENSA_PONTO', 'OUTRA');

-- CreateEnum
CREATE TYPE "StatusHomologacao" AS ENUM ('ABERTA', 'COM_PENDENCIAS', 'HOMOLOGADA', 'REABERTA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "StatusBoletim" AS ENUM ('RASCUNHO', 'GERADO', 'ENVIADO_SECAP', 'RECEBIDO_SECAP', 'COM_PENDENCIA', 'FINALIZADO');

-- CreateEnum
CREATE TYPE "TipoEventoAuditoria" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'SWITCH_PROFILE', 'APPROVE', 'REJECT', 'HOMOLOGATE', 'RECALCULATE', 'EXPORT', 'IMPORT', 'SYSTEM');

-- CreateTable
CREATE TABLE "auth_accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "auth_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "perfilAtivoId" TEXT,

    CONSTRAINT "auth_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT,
    "login" TEXT NOT NULL,
    "matricula" TEXT,
    "senhaHash" TEXT,
    "adUsername" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "ultimoAcessoEm" TIMESTAMP(3),
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perfis" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "tipo" "TipoPerfilSistema" NOT NULL DEFAULT 'CUSTOMIZADO',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "perfis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissoes" (
    "id" TEXT NOT NULL,
    "recurso" TEXT NOT NULL,
    "acao" TEXT NOT NULL,
    "escopo" TEXT NOT NULL,
    "descricao" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "permissoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios_perfis" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "perfilId" TEXT NOT NULL,
    "unidadeId" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_perfis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perfis_permissoes" (
    "id" TEXT NOT NULL,
    "perfilId" TEXT NOT NULL,
    "permissaoId" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "perfis_permissoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orgaos" (
    "id" TEXT NOT NULL,
    "sigla" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orgaos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unidades_organizacionais" (
    "id" TEXT NOT NULL,
    "orgaoId" TEXT NOT NULL,
    "unidadePaiId" TEXT,
    "sigla" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "unidades_organizacionais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chefias_unidades" (
    "id" TEXT NOT NULL,
    "unidadeId" TEXT NOT NULL,
    "servidorId" TEXT NOT NULL,
    "titular" BOOLEAN NOT NULL DEFAULT true,
    "inicioEm" TIMESTAMP(3) NOT NULL,
    "fimEm" TIMESTAMP(3),
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "chefias_unidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "delegacoes_chefia" (
    "id" TEXT NOT NULL,
    "chefiaUnidadeId" TEXT NOT NULL,
    "servidorId" TEXT NOT NULL,
    "inicioEm" TIMESTAMP(3) NOT NULL,
    "fimEm" TIMESTAMP(3),
    "atoDelegacao" TEXT,
    "ativa" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "delegacoes_chefia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "servidores" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "matricula" TEXT NOT NULL,
    "nomeFuncional" TEXT NOT NULL,
    "cargo" TEXT,
    "funcao" TEXT,
    "emailFuncional" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "servidores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lotacoes_servidores" (
    "id" TEXT NOT NULL,
    "servidorId" TEXT NOT NULL,
    "unidadeId" TEXT NOT NULL,
    "principal" BOOLEAN NOT NULL DEFAULT true,
    "inicioEm" TIMESTAMP(3) NOT NULL,
    "fimEm" TIMESTAMP(3),
    "ativa" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "lotacoes_servidores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jornadas" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" "TipoJornada" NOT NULL,
    "cargaMinutosDia" INTEGER NOT NULL,
    "exigeIntervalo" BOOLEAN NOT NULL DEFAULT false,
    "intervaloMinMinutos" INTEGER,
    "intervaloMaxMinutos" INTEGER,
    "horarioInicioPadrao" TEXT,
    "horarioFimPadrao" TEXT,
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jornadas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jornadas_unidades" (
    "id" TEXT NOT NULL,
    "jornadaId" TEXT NOT NULL,
    "unidadeId" TEXT NOT NULL,
    "inicioEm" TIMESTAMP(3) NOT NULL,
    "fimEm" TIMESTAMP(3),
    "ativa" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "jornadas_unidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jornadas_servidores" (
    "id" TEXT NOT NULL,
    "servidorId" TEXT NOT NULL,
    "jornadaId" TEXT NOT NULL,
    "inicioEm" TIMESTAMP(3) NOT NULL,
    "fimEm" TIMESTAMP(3),
    "ativa" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "jornadas_servidores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calendarios" (
    "id" TEXT NOT NULL,
    "orgaoId" TEXT,
    "nome" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "calendarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feriados" (
    "id" TEXT NOT NULL,
    "calendarioId" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "nome" TEXT NOT NULL,
    "recorrente" BOOLEAN NOT NULL DEFAULT false,
    "pontoFacultativo" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "feriados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipamentos_ponto" (
    "id" TEXT NOT NULL,
    "unidadeId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "localizacao" TEXT,
    "ip" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "equipamentos_ponto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marcacoes_ponto" (
    "id" TEXT NOT NULL,
    "servidorId" TEXT NOT NULL,
    "equipamentoId" TEXT,
    "tipo" "TipoMarcacao" NOT NULL,
    "origem" "OrigemMarcacao" NOT NULL,
    "status" "StatusMarcacao" NOT NULL DEFAULT 'VALIDA',
    "dataHora" TIMESTAMP(3) NOT NULL,
    "dataReferencia" TIMESTAMP(3) NOT NULL,
    "justificativa" TEXT,
    "ipOrigem" TEXT,
    "userAgent" TEXT,
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "criadaEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "marcacaoOriginalId" TEXT,

    CONSTRAINT "marcacoes_ponto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "espelhos_diarios" (
    "id" TEXT NOT NULL,
    "servidorId" TEXT NOT NULL,
    "dataReferencia" TIMESTAMP(3) NOT NULL,
    "jornadaPrevistaMinutos" INTEGER NOT NULL,
    "jornadaRealizadaMinutos" INTEGER NOT NULL DEFAULT 0,
    "intervaloMinutos" INTEGER NOT NULL DEFAULT 0,
    "creditoMinutos" INTEGER NOT NULL DEFAULT 0,
    "debitoMinutos" INTEGER NOT NULL DEFAULT 0,
    "horasNaoAutorizadasMinutos" INTEGER NOT NULL DEFAULT 0,
    "horasAcimaLimiteMinutos" INTEGER NOT NULL DEFAULT 0,
    "possuiInconsistencia" BOOLEAN NOT NULL DEFAULT false,
    "homologado" BOOLEAN NOT NULL DEFAULT false,
    "recalculadoEm" TIMESTAMP(3),
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "espelhos_diarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "espelhos_mensais" (
    "id" TEXT NOT NULL,
    "servidorId" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "mes" INTEGER NOT NULL,
    "cargaPrevistaMinutos" INTEGER NOT NULL DEFAULT 0,
    "cargaRealizadaMinutos" INTEGER NOT NULL DEFAULT 0,
    "creditoMinutos" INTEGER NOT NULL DEFAULT 0,
    "debitoMinutos" INTEGER NOT NULL DEFAULT 0,
    "saldoFinalMinutos" INTEGER NOT NULL DEFAULT 0,
    "horasNaoAutorizadasMinutos" INTEGER NOT NULL DEFAULT 0,
    "horasAcimaLimiteMinutos" INTEGER NOT NULL DEFAULT 0,
    "possuiPendencia" BOOLEAN NOT NULL DEFAULT false,
    "fechado" BOOLEAN NOT NULL DEFAULT false,
    "recalculadoEm" TIMESTAMP(3),
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "espelhos_mensais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bancos_horas" (
    "id" TEXT NOT NULL,
    "servidorId" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "mes" INTEGER NOT NULL,
    "saldoInicialMinutos" INTEGER NOT NULL DEFAULT 0,
    "creditoMinutos" INTEGER NOT NULL DEFAULT 0,
    "debitoMinutos" INTEGER NOT NULL DEFAULT 0,
    "saldoFinalMinutos" INTEGER NOT NULL DEFAULT 0,
    "limiteMensalCreditoMinutos" INTEGER NOT NULL DEFAULT 960,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bancos_horas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movimentos_banco_horas" (
    "id" TEXT NOT NULL,
    "bancoHorasId" TEXT NOT NULL,
    "tipo" "TipoMovimentoBancoHoras" NOT NULL,
    "minutos" INTEGER NOT NULL,
    "dataReferencia" TIMESTAMP(3) NOT NULL,
    "descricao" TEXT,
    "solicitacaoId" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movimentos_banco_horas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "solicitacoes" (
    "id" TEXT NOT NULL,
    "tipo" "TipoSolicitacao" NOT NULL,
    "status" "StatusSolicitacao" NOT NULL DEFAULT 'ENVIADA',
    "servidorId" TEXT NOT NULL,
    "solicitanteId" TEXT NOT NULL,
    "dataReferencia" TIMESTAMP(3),
    "inicioEm" TIMESTAMP(3),
    "fimEm" TIMESTAMP(3),
    "justificativa" TEXT NOT NULL,
    "respostaFinal" TEXT,
    "criadaEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadaEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "solicitacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "decisoes_solicitacoes" (
    "id" TEXT NOT NULL,
    "solicitacaoId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "aprovada" BOOLEAN NOT NULL,
    "observacao" TEXT,
    "decididaEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "decisoes_solicitacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anexos_solicitacoes" (
    "id" TEXT NOT NULL,
    "solicitacaoId" TEXT NOT NULL,
    "nomeArquivo" TEXT NOT NULL,
    "caminhoArquivo" TEXT NOT NULL,
    "mimeType" TEXT,
    "tamanhoBytes" INTEGER,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "anexos_solicitacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "homologacoes_mensais" (
    "id" TEXT NOT NULL,
    "unidadeId" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "mes" INTEGER NOT NULL,
    "status" "StatusHomologacao" NOT NULL DEFAULT 'ABERTA',
    "homologadorId" TEXT,
    "homologadaEm" TIMESTAMP(3),
    "observacao" TEXT,
    "criadaEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadaEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "homologacoes_mensais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "homologacoes_mensais_servidores" (
    "id" TEXT NOT NULL,
    "homologacaoId" TEXT NOT NULL,
    "servidorId" TEXT NOT NULL,
    "possuiPendencia" BOOLEAN NOT NULL DEFAULT false,
    "observacao" TEXT,
    "homologado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "homologacoes_mensais_servidores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "boletins_frequencia" (
    "id" TEXT NOT NULL,
    "homologacaoId" TEXT NOT NULL,
    "unidadeId" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "mes" INTEGER NOT NULL,
    "status" "StatusBoletim" NOT NULL DEFAULT 'RASCUNHO',
    "geradoEm" TIMESTAMP(3),
    "enviadoEm" TIMESTAMP(3),
    "recebidoEm" TIMESTAMP(3),
    "observacao" TEXT,

    CONSTRAINT "boletins_frequencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auditorias" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT,
    "tipoEvento" "TipoEventoAuditoria" NOT NULL,
    "entidade" TEXT NOT NULL,
    "entidadeId" TEXT,
    "descricao" TEXT,
    "payloadAntes" JSONB,
    "payloadDepois" JSONB,
    "ipOrigem" TEXT,
    "userAgent" TEXT,
    "perfilAtivo" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auditorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "integracoes_externas" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "endpoint" TEXT,
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "configuracao" JSONB,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "integracoes_externas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventos_integracao" (
    "id" TEXT NOT NULL,
    "integracaoId" TEXT NOT NULL,
    "tipoEvento" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "payload" JSONB,
    "resposta" JSONB,
    "erro" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processadoEm" TIMESTAMP(3),

    CONSTRAINT "eventos_integracao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "auth_accounts_provider_providerAccountId_key" ON "auth_accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "auth_sessions_sessionToken_key" ON "auth_sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "auth_verification_tokens_token_key" ON "auth_verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "auth_verification_tokens_identifier_token_key" ON "auth_verification_tokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_login_key" ON "usuarios"("login");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_matricula_key" ON "usuarios"("matricula");

-- CreateIndex
CREATE UNIQUE INDEX "perfis_nome_key" ON "perfis"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "permissoes_recurso_acao_escopo_key" ON "permissoes"("recurso", "acao", "escopo");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_perfis_usuarioId_perfilId_unidadeId_key" ON "usuarios_perfis"("usuarioId", "perfilId", "unidadeId");

-- CreateIndex
CREATE UNIQUE INDEX "perfis_permissoes_perfilId_permissaoId_key" ON "perfis_permissoes"("perfilId", "permissaoId");

-- CreateIndex
CREATE UNIQUE INDEX "orgaos_sigla_key" ON "orgaos"("sigla");

-- CreateIndex
CREATE UNIQUE INDEX "unidades_organizacionais_orgaoId_sigla_key" ON "unidades_organizacionais"("orgaoId", "sigla");

-- CreateIndex
CREATE UNIQUE INDEX "servidores_usuarioId_key" ON "servidores"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "servidores_matricula_key" ON "servidores"("matricula");

-- CreateIndex
CREATE UNIQUE INDEX "jornadas_nome_key" ON "jornadas"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "jornadas_unidades_jornadaId_unidadeId_inicioEm_key" ON "jornadas_unidades"("jornadaId", "unidadeId", "inicioEm");

-- CreateIndex
CREATE UNIQUE INDEX "calendarios_nome_ano_key" ON "calendarios"("nome", "ano");

-- CreateIndex
CREATE UNIQUE INDEX "equipamentos_ponto_codigo_key" ON "equipamentos_ponto"("codigo");

-- CreateIndex
CREATE INDEX "marcacoes_ponto_servidorId_dataReferencia_idx" ON "marcacoes_ponto"("servidorId", "dataReferencia");

-- CreateIndex
CREATE UNIQUE INDEX "espelhos_diarios_servidorId_dataReferencia_key" ON "espelhos_diarios"("servidorId", "dataReferencia");

-- CreateIndex
CREATE UNIQUE INDEX "espelhos_mensais_servidorId_ano_mes_key" ON "espelhos_mensais"("servidorId", "ano", "mes");

-- CreateIndex
CREATE UNIQUE INDEX "bancos_horas_servidorId_ano_mes_key" ON "bancos_horas"("servidorId", "ano", "mes");

-- CreateIndex
CREATE UNIQUE INDEX "homologacoes_mensais_unidadeId_ano_mes_key" ON "homologacoes_mensais"("unidadeId", "ano", "mes");

-- CreateIndex
CREATE UNIQUE INDEX "homologacoes_mensais_servidores_homologacaoId_servidorId_key" ON "homologacoes_mensais_servidores"("homologacaoId", "servidorId");

-- CreateIndex
CREATE UNIQUE INDEX "boletins_frequencia_homologacaoId_key" ON "boletins_frequencia"("homologacaoId");

-- CreateIndex
CREATE INDEX "auditorias_entidade_entidadeId_idx" ON "auditorias"("entidade", "entidadeId");

-- CreateIndex
CREATE INDEX "auditorias_usuarioId_idx" ON "auditorias"("usuarioId");

-- CreateIndex
CREATE INDEX "auditorias_criadoEm_idx" ON "auditorias"("criadoEm");

-- AddForeignKey
ALTER TABLE "auth_accounts" ADD CONSTRAINT "auth_accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_sessions" ADD CONSTRAINT "auth_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_sessions" ADD CONSTRAINT "auth_sessions_perfilAtivoId_fkey" FOREIGN KEY ("perfilAtivoId") REFERENCES "perfis"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios_perfis" ADD CONSTRAINT "usuarios_perfis_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios_perfis" ADD CONSTRAINT "usuarios_perfis_perfilId_fkey" FOREIGN KEY ("perfilId") REFERENCES "perfis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios_perfis" ADD CONSTRAINT "usuarios_perfis_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES "unidades_organizacionais"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perfis_permissoes" ADD CONSTRAINT "perfis_permissoes_perfilId_fkey" FOREIGN KEY ("perfilId") REFERENCES "perfis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perfis_permissoes" ADD CONSTRAINT "perfis_permissoes_permissaoId_fkey" FOREIGN KEY ("permissaoId") REFERENCES "permissoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unidades_organizacionais" ADD CONSTRAINT "unidades_organizacionais_orgaoId_fkey" FOREIGN KEY ("orgaoId") REFERENCES "orgaos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unidades_organizacionais" ADD CONSTRAINT "unidades_organizacionais_unidadePaiId_fkey" FOREIGN KEY ("unidadePaiId") REFERENCES "unidades_organizacionais"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chefias_unidades" ADD CONSTRAINT "chefias_unidades_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES "unidades_organizacionais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chefias_unidades" ADD CONSTRAINT "chefias_unidades_servidorId_fkey" FOREIGN KEY ("servidorId") REFERENCES "servidores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delegacoes_chefia" ADD CONSTRAINT "delegacoes_chefia_chefiaUnidadeId_fkey" FOREIGN KEY ("chefiaUnidadeId") REFERENCES "chefias_unidades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delegacoes_chefia" ADD CONSTRAINT "delegacoes_chefia_servidorId_fkey" FOREIGN KEY ("servidorId") REFERENCES "servidores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servidores" ADD CONSTRAINT "servidores_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lotacoes_servidores" ADD CONSTRAINT "lotacoes_servidores_servidorId_fkey" FOREIGN KEY ("servidorId") REFERENCES "servidores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lotacoes_servidores" ADD CONSTRAINT "lotacoes_servidores_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES "unidades_organizacionais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jornadas_unidades" ADD CONSTRAINT "jornadas_unidades_jornadaId_fkey" FOREIGN KEY ("jornadaId") REFERENCES "jornadas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jornadas_unidades" ADD CONSTRAINT "jornadas_unidades_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES "unidades_organizacionais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jornadas_servidores" ADD CONSTRAINT "jornadas_servidores_servidorId_fkey" FOREIGN KEY ("servidorId") REFERENCES "servidores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jornadas_servidores" ADD CONSTRAINT "jornadas_servidores_jornadaId_fkey" FOREIGN KEY ("jornadaId") REFERENCES "jornadas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feriados" ADD CONSTRAINT "feriados_calendarioId_fkey" FOREIGN KEY ("calendarioId") REFERENCES "calendarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipamentos_ponto" ADD CONSTRAINT "equipamentos_ponto_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES "unidades_organizacionais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marcacoes_ponto" ADD CONSTRAINT "marcacoes_ponto_marcacaoOriginalId_fkey" FOREIGN KEY ("marcacaoOriginalId") REFERENCES "marcacoes_ponto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marcacoes_ponto" ADD CONSTRAINT "marcacoes_ponto_servidorId_fkey" FOREIGN KEY ("servidorId") REFERENCES "servidores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marcacoes_ponto" ADD CONSTRAINT "marcacoes_ponto_equipamentoId_fkey" FOREIGN KEY ("equipamentoId") REFERENCES "equipamentos_ponto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "espelhos_diarios" ADD CONSTRAINT "espelhos_diarios_servidorId_fkey" FOREIGN KEY ("servidorId") REFERENCES "servidores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "espelhos_mensais" ADD CONSTRAINT "espelhos_mensais_servidorId_fkey" FOREIGN KEY ("servidorId") REFERENCES "servidores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bancos_horas" ADD CONSTRAINT "bancos_horas_servidorId_fkey" FOREIGN KEY ("servidorId") REFERENCES "servidores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimentos_banco_horas" ADD CONSTRAINT "movimentos_banco_horas_bancoHorasId_fkey" FOREIGN KEY ("bancoHorasId") REFERENCES "bancos_horas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimentos_banco_horas" ADD CONSTRAINT "movimentos_banco_horas_solicitacaoId_fkey" FOREIGN KEY ("solicitacaoId") REFERENCES "solicitacoes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitacoes" ADD CONSTRAINT "solicitacoes_servidorId_fkey" FOREIGN KEY ("servidorId") REFERENCES "servidores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitacoes" ADD CONSTRAINT "solicitacoes_solicitanteId_fkey" FOREIGN KEY ("solicitanteId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decisoes_solicitacoes" ADD CONSTRAINT "decisoes_solicitacoes_solicitacaoId_fkey" FOREIGN KEY ("solicitacaoId") REFERENCES "solicitacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decisoes_solicitacoes" ADD CONSTRAINT "decisoes_solicitacoes_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anexos_solicitacoes" ADD CONSTRAINT "anexos_solicitacoes_solicitacaoId_fkey" FOREIGN KEY ("solicitacaoId") REFERENCES "solicitacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "homologacoes_mensais" ADD CONSTRAINT "homologacoes_mensais_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES "unidades_organizacionais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "homologacoes_mensais" ADD CONSTRAINT "homologacoes_mensais_homologadorId_fkey" FOREIGN KEY ("homologadorId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "homologacoes_mensais_servidores" ADD CONSTRAINT "homologacoes_mensais_servidores_homologacaoId_fkey" FOREIGN KEY ("homologacaoId") REFERENCES "homologacoes_mensais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "homologacoes_mensais_servidores" ADD CONSTRAINT "homologacoes_mensais_servidores_servidorId_fkey" FOREIGN KEY ("servidorId") REFERENCES "servidores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boletins_frequencia" ADD CONSTRAINT "boletins_frequencia_homologacaoId_fkey" FOREIGN KEY ("homologacaoId") REFERENCES "homologacoes_mensais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boletins_frequencia" ADD CONSTRAINT "boletins_frequencia_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES "unidades_organizacionais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auditorias" ADD CONSTRAINT "auditorias_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventos_integracao" ADD CONSTRAINT "eventos_integracao_integracaoId_fkey" FOREIGN KEY ("integracaoId") REFERENCES "integracoes_externas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
