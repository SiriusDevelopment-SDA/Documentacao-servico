/*
  Warnings:

  - You are about to drop the column `codigo` on the `RegraNegocio` table. All the data in the column will be lost.
  - You are about to drop the `Parametro` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RegraParametroNecessario` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Parametro" DROP CONSTRAINT "Parametro_erpId_fkey";

-- DropForeignKey
ALTER TABLE "public"."RegraNegocio" DROP CONSTRAINT "RegraNegocio_parametroPadraoId_fkey";

-- DropForeignKey
ALTER TABLE "public"."RegraParametroNecessario" DROP CONSTRAINT "RegraParametroNecessario_parametroId_fkey";

-- DropForeignKey
ALTER TABLE "public"."RegraParametroNecessario" DROP CONSTRAINT "RegraParametroNecessario_regraId_fkey";

-- DropIndex
DROP INDEX "public"."RegraNegocio_codigo_erpId_key";

-- AlterTable
ALTER TABLE "RegraNegocio" DROP COLUMN "codigo";

-- DropTable
DROP TABLE "public"."Parametro";

-- DropTable
DROP TABLE "public"."RegraParametroNecessario";

-- CreateTable
CREATE TABLE "ParametroPadrao" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "erpId" INTEGER NOT NULL,

    CONSTRAINT "ParametroPadrao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParametroNecessario" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "erpId" INTEGER NOT NULL,

    CONSTRAINT "ParametroNecessario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegraNegocioParametroNecessario" (
    "id" SERIAL NOT NULL,
    "regraId" INTEGER NOT NULL,
    "parametroNecessarioId" INTEGER NOT NULL,

    CONSTRAINT "RegraNegocioParametroNecessario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ParametroPadrao_nome_erpId_key" ON "ParametroPadrao"("nome", "erpId");

-- CreateIndex
CREATE UNIQUE INDEX "ParametroNecessario_nome_erpId_key" ON "ParametroNecessario"("nome", "erpId");

-- CreateIndex
CREATE UNIQUE INDEX "RegraNegocioParametroNecessario_regraId_parametroNecessario_key" ON "RegraNegocioParametroNecessario"("regraId", "parametroNecessarioId");

-- AddForeignKey
ALTER TABLE "ParametroPadrao" ADD CONSTRAINT "ParametroPadrao_erpId_fkey" FOREIGN KEY ("erpId") REFERENCES "Erp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParametroNecessario" ADD CONSTRAINT "ParametroNecessario_erpId_fkey" FOREIGN KEY ("erpId") REFERENCES "Erp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegraNegocio" ADD CONSTRAINT "RegraNegocio_parametroPadraoId_fkey" FOREIGN KEY ("parametroPadraoId") REFERENCES "ParametroPadrao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegraNegocioParametroNecessario" ADD CONSTRAINT "RegraNegocioParametroNecessario_regraId_fkey" FOREIGN KEY ("regraId") REFERENCES "RegraNegocio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegraNegocioParametroNecessario" ADD CONSTRAINT "RegraNegocioParametroNecessario_parametroNecessarioId_fkey" FOREIGN KEY ("parametroNecessarioId") REFERENCES "ParametroNecessario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
