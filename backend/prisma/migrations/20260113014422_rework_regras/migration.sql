/*
  Warnings:

  - You are about to drop the column `parametroPadraoId` on the `RegraNegocio` table. All the data in the column will be lost.
  - You are about to drop the column `parametros_obrigatorios` on the `RegraNegocio` table. All the data in the column will be lost.
  - You are about to drop the column `parametros_padrao` on the `RegraNegocio` table. All the data in the column will be lost.
  - You are about to drop the column `setor` on the `RegraNegocio` table. All the data in the column will be lost.
  - You are about to drop the column `setores` on the `RegraNegocio` table. All the data in the column will be lost.
  - You are about to drop the `RegraNegocioParametroNecessario` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."RegraNegocio" DROP CONSTRAINT "RegraNegocio_parametroPadraoId_fkey";

-- DropForeignKey
ALTER TABLE "public"."RegraNegocioParametroNecessario" DROP CONSTRAINT "RegraNegocioParametroNecessario_parametroNecessarioId_fkey";

-- DropForeignKey
ALTER TABLE "public"."RegraNegocioParametroNecessario" DROP CONSTRAINT "RegraNegocioParametroNecessario_regraId_fkey";

-- AlterTable
ALTER TABLE "RegraNegocio" DROP COLUMN "parametroPadraoId",
DROP COLUMN "parametros_obrigatorios",
DROP COLUMN "parametros_padrao",
DROP COLUMN "setor",
DROP COLUMN "setores",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "public"."RegraNegocioParametroNecessario";

-- CreateTable
CREATE TABLE "RegraSetor" (
    "id" SERIAL NOT NULL,
    "regraId" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "RegraSetor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SetorParametroPadrao" (
    "id" SERIAL NOT NULL,
    "setorId" INTEGER NOT NULL,
    "padraoId" INTEGER NOT NULL,

    CONSTRAINT "SetorParametroPadrao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SetorParametroNecessario" (
    "id" SERIAL NOT NULL,
    "setorId" INTEGER NOT NULL,
    "necessarioId" INTEGER NOT NULL,

    CONSTRAINT "SetorParametroNecessario_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RegraSetor" ADD CONSTRAINT "RegraSetor_regraId_fkey" FOREIGN KEY ("regraId") REFERENCES "RegraNegocio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SetorParametroPadrao" ADD CONSTRAINT "SetorParametroPadrao_setorId_fkey" FOREIGN KEY ("setorId") REFERENCES "RegraSetor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SetorParametroPadrao" ADD CONSTRAINT "SetorParametroPadrao_padraoId_fkey" FOREIGN KEY ("padraoId") REFERENCES "ParametroPadrao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SetorParametroNecessario" ADD CONSTRAINT "SetorParametroNecessario_setorId_fkey" FOREIGN KEY ("setorId") REFERENCES "RegraSetor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SetorParametroNecessario" ADD CONSTRAINT "SetorParametroNecessario_necessarioId_fkey" FOREIGN KEY ("necessarioId") REFERENCES "ParametroNecessario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
