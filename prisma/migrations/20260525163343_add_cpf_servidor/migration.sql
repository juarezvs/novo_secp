/*
  Warnings:

  - A unique constraint covering the columns `[cpf]` on the table `servidores` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cpf` to the `servidores` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "servidores" ADD COLUMN     "cpf" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "servidores_cpf_key" ON "servidores"("cpf");
