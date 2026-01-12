/*
  Ajuste seguro para tornar `setores` obrigatório
  - Atualiza registros antigos com um JSON padrão
  - Só depois altera a coluna para NOT NULL
*/

-- 1) Drop da FK antiga
ALTER TABLE "public"."RegraNegocio"
DROP CONSTRAINT IF EXISTS "RegraNegocio_parametroPadraoId_fkey";

-- 2) Corrigir registros antigos que possuem `setores = NULL`
UPDATE "public"."RegraNegocio"
SET "setores" = '[]'
WHERE "setores" IS NULL;

-- 3) Agora é seguro tornar NOT NULL
ALTER TABLE "public"."RegraNegocio"
ALTER COLUMN "setores" SET NOT NULL;

-- 4) Tornar coluna parametroPadraoId opcional
ALTER TABLE "public"."RegraNegocio"
ALTER COLUMN "parametroPadraoId" DROP NOT NULL;

-- 5) Tornar setor opcional (pois não usaremos mais)
ALTER TABLE "public"."RegraNegocio"
ALTER COLUMN "setor" DROP NOT NULL;

-- 6) Recriar FK com ON DELETE SET NULL
ALTER TABLE "public"."RegraNegocio"
ADD CONSTRAINT "RegraNegocio_parametroPadraoId_fkey"
FOREIGN KEY ("parametroPadraoId") REFERENCES "ParametroPadrao"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
