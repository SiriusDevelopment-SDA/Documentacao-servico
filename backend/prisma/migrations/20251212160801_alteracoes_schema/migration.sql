/*
  Warnings:

  - Added the required column `empresaId` to the `Documentacao` table without a default value. This is not possible if the table is not empty.
  - Made the column `erpId` on table `Documentacao` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Documentacao" DROP CONSTRAINT "Documentacao_erpId_fkey";

-- AlterTable
ALTER TABLE "Documentacao" ADD COLUMN     "empresaId" INTEGER NOT NULL,
ALTER COLUMN "erpId" SET NOT NULL;

-- CreateTable
CREATE TABLE "Sistema" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Sistema_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Empresa" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cnpj" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "erpId" INTEGER NOT NULL,

    CONSTRAINT "Empresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SistemaErps" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_SistemaErps_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sistema_nome_key" ON "Sistema"("nome");

-- CreateIndex
CREATE INDEX "_SistemaErps_B_index" ON "_SistemaErps"("B");

-- AddForeignKey
ALTER TABLE "Empresa" ADD CONSTRAINT "Empresa_erpId_fkey" FOREIGN KEY ("erpId") REFERENCES "Erp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documentacao" ADD CONSTRAINT "Documentacao_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documentacao" ADD CONSTRAINT "Documentacao_erpId_fkey" FOREIGN KEY ("erpId") REFERENCES "Erp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SistemaErps" ADD CONSTRAINT "_SistemaErps_A_fkey" FOREIGN KEY ("A") REFERENCES "Erp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SistemaErps" ADD CONSTRAINT "_SistemaErps_B_fkey" FOREIGN KEY ("B") REFERENCES "Sistema"("id") ON DELETE CASCADE ON UPDATE CASCADE;
