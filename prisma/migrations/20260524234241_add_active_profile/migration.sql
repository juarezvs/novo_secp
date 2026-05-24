-- CreateTable
CREATE TABLE "perfis_ativos_usuarios" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "perfilId" TEXT NOT NULL,
    "unidadeId" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "perfis_ativos_usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "perfis_ativos_usuarios_usuarioId_key" ON "perfis_ativos_usuarios"("usuarioId");

-- AddForeignKey
ALTER TABLE "perfis_ativos_usuarios" ADD CONSTRAINT "perfis_ativos_usuarios_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perfis_ativos_usuarios" ADD CONSTRAINT "perfis_ativos_usuarios_perfilId_fkey" FOREIGN KEY ("perfilId") REFERENCES "perfis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perfis_ativos_usuarios" ADD CONSTRAINT "perfis_ativos_usuarios_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES "unidades_organizacionais"("id") ON DELETE SET NULL ON UPDATE CASCADE;
