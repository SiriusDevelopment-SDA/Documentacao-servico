-- DropForeignKey
ALTER TABLE "public"."Documentacao" DROP CONSTRAINT "Documentacao_erpId_fkey";

-- AlterTable
ALTER TABLE "Documentacao" ALTER COLUMN "numero_contrato" DROP NOT NULL,
ALTER COLUMN "erpId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Documentacao" ADD CONSTRAINT "Documentacao_erpId_fkey" FOREIGN KEY ("erpId") REFERENCES "ERP"("id") ON DELETE SET NULL ON UPDATE CASCADE;
