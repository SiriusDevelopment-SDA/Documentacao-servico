-- CreateTable
CREATE TABLE "Empresa" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf_cnpj" TEXT,
    "erpId" INTEGER NOT NULL,

    CONSTRAINT "Empresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Parametro" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "erpId" INTEGER NOT NULL,

    CONSTRAINT "Parametro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegraNegocio" (
    "id" SERIAL NOT NULL,
    "parametros_padrao" TEXT NOT NULL,
    "parametros_obrigatorios" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "erpId" INTEGER NOT NULL,
    "parametroPadraoId" INTEGER NOT NULL,

    CONSTRAINT "RegraNegocio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegraParametroNecessario" (
    "id" SERIAL NOT NULL,
    "regraId" INTEGER NOT NULL,
    "parametroId" INTEGER NOT NULL,

    CONSTRAINT "RegraParametroNecessario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmpresaRegra" (
    "id" SERIAL NOT NULL,
    "empresaId" INTEGER NOT NULL,
    "regraId" INTEGER NOT NULL,
    "ativa" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "EmpresaRegra_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_nome_key" ON "Empresa"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_cpf_cnpj_key" ON "Empresa"("cpf_cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Parametro_codigo_erpId_key" ON "Parametro"("codigo", "erpId");

-- CreateIndex
CREATE UNIQUE INDEX "RegraNegocio_codigo_erpId_key" ON "RegraNegocio"("codigo", "erpId");

-- CreateIndex
CREATE UNIQUE INDEX "RegraParametroNecessario_regraId_parametroId_key" ON "RegraParametroNecessario"("regraId", "parametroId");

-- CreateIndex
CREATE UNIQUE INDEX "EmpresaRegra_empresaId_regraId_key" ON "EmpresaRegra"("empresaId", "regraId");

-- AddForeignKey
ALTER TABLE "Empresa" ADD CONSTRAINT "Empresa_erpId_fkey" FOREIGN KEY ("erpId") REFERENCES "Erp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parametro" ADD CONSTRAINT "Parametro_erpId_fkey" FOREIGN KEY ("erpId") REFERENCES "Erp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegraNegocio" ADD CONSTRAINT "RegraNegocio_erpId_fkey" FOREIGN KEY ("erpId") REFERENCES "Erp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegraNegocio" ADD CONSTRAINT "RegraNegocio_parametroPadraoId_fkey" FOREIGN KEY ("parametroPadraoId") REFERENCES "Parametro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegraParametroNecessario" ADD CONSTRAINT "RegraParametroNecessario_regraId_fkey" FOREIGN KEY ("regraId") REFERENCES "RegraNegocio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegraParametroNecessario" ADD CONSTRAINT "RegraParametroNecessario_parametroId_fkey" FOREIGN KEY ("parametroId") REFERENCES "Parametro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmpresaRegra" ADD CONSTRAINT "EmpresaRegra_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmpresaRegra" ADD CONSTRAINT "EmpresaRegra_regraId_fkey" FOREIGN KEY ("regraId") REFERENCES "RegraNegocio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
