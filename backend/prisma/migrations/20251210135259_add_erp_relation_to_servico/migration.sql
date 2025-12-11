/*
  Warnings:

  - You are about to drop the `ERP` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `erpId` to the `Servico` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Documentacao" DROP CONSTRAINT "Documentacao_erpId_fkey";

-- AlterTable
ALTER TABLE "Servico" ADD COLUMN     "erpId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "public"."ERP";

-- CreateTable
CREATE TABLE "Erp" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Erp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Erp_nome_key" ON "Erp"("nome");

-- AddForeignKey
ALTER TABLE "Documentacao" ADD CONSTRAINT "Documentacao_erpId_fkey" FOREIGN KEY ("erpId") REFERENCES "Erp"("id") ON DELETE SET NULL ON UPDATE CASCADE;
