/*
  Warnings:

  - You are about to drop the column `empresaId` on the `Documentacao` table. All the data in the column will be lost.
  - You are about to drop the `Empresa` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Documentacao" DROP CONSTRAINT "Documentacao_empresaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Empresa" DROP CONSTRAINT "Empresa_erpId_fkey";

-- AlterTable
ALTER TABLE "Documentacao" DROP COLUMN "empresaId";

-- DropTable
DROP TABLE "public"."Empresa";
