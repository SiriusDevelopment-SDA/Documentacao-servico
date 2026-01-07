/*
  Warnings:

  - Added the required column `setor` to the `RegraNegocio` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RegraNegocio" ADD COLUMN     "setor" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ParametroPadraoParametroNecessario" (
    "id" SERIAL NOT NULL,
    "parametroPadraoId" INTEGER NOT NULL,
    "parametroNecessarioId" INTEGER NOT NULL,
    "obrigatorio" BOOLEAN NOT NULL DEFAULT true,
    "ordem" INTEGER,

    CONSTRAINT "ParametroPadraoParametroNecessario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ParametroPadraoParametroNecessario_parametroPadraoId_parame_key" ON "ParametroPadraoParametroNecessario"("parametroPadraoId", "parametroNecessarioId");

-- AddForeignKey
ALTER TABLE "ParametroPadraoParametroNecessario" ADD CONSTRAINT "ParametroPadraoParametroNecessario_parametroPadraoId_fkey" FOREIGN KEY ("parametroPadraoId") REFERENCES "ParametroPadrao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParametroPadraoParametroNecessario" ADD CONSTRAINT "ParametroPadraoParametroNecessario_parametroNecessarioId_fkey" FOREIGN KEY ("parametroNecessarioId") REFERENCES "ParametroNecessario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
