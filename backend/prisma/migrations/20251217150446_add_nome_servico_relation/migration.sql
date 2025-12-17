/*
  Warnings:

  - You are about to drop the column `nome` on the `Servico` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nome]` on the table `NomeServico` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nomeServicoId` to the `Servico` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Servico" DROP COLUMN "nome",
ADD COLUMN     "nomeServicoId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "NomeServico_nome_key" ON "NomeServico"("nome");

-- AddForeignKey
ALTER TABLE "Servico" ADD CONSTRAINT "Servico_nomeServicoId_fkey" FOREIGN KEY ("nomeServicoId") REFERENCES "NomeServico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
