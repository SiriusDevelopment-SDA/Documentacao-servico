-- CreateTable
CREATE TABLE "Sistema" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "logoUrl" TEXT,

    CONSTRAINT "Sistema_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Erp" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Erp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Documentacao" (
    "id" SERIAL NOT NULL,
    "nome_empresa" TEXT NOT NULL,
    "nome_contratante" TEXT NOT NULL,
    "documentado_por" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "numero_contrato" TEXT,
    "info_adicionais" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "erpId" INTEGER,

    CONSTRAINT "Documentacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Servico" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT,
    "instrucoes" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "sem_necessidade_api" BOOLEAN NOT NULL DEFAULT false,
    "endpoint" TEXT,
    "parametros_padrao" JSONB,
    "exige_contrato" BOOLEAN NOT NULL DEFAULT false,
    "exige_cpf_cnpj" BOOLEAN NOT NULL DEFAULT false,
    "exige_login_ativo" BOOLEAN NOT NULL DEFAULT false,
    "responsavel_padrao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "documentacaoId" INTEGER NOT NULL,
    "erpId" INTEGER NOT NULL,
    "nomeServicoId" INTEGER NOT NULL,
    "dataDesativacao" TIMESTAMP(3),
    "motivoDesativacao" TEXT,

    CONSTRAINT "Servico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServicoDesejado" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "documentacaoId" INTEGER NOT NULL,

    CONSTRAINT "ServicoDesejado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NomeServico" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "NomeServico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Empresa" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf_cnpj" TEXT,
    "erpId" INTEGER NOT NULL,

    CONSTRAINT "Empresa_pkey" PRIMARY KEY ("id")
);

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
CREATE TABLE "ParametroPadraoParametroNecessario" (
    "id" SERIAL NOT NULL,
    "parametroPadraoId" INTEGER NOT NULL,
    "parametroNecessarioId" INTEGER NOT NULL,
    "obrigatorio" BOOLEAN NOT NULL DEFAULT true,
    "ordem" INTEGER,

    CONSTRAINT "ParametroPadraoParametroNecessario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegraNegocio" (
    "id" SERIAL NOT NULL,
    "parametros_padrao" TEXT NOT NULL,
    "parametros_obrigatorios" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "erpId" INTEGER NOT NULL,
    "parametroPadraoId" INTEGER NOT NULL,
    "setor" TEXT NOT NULL,
    "setores" JSONB,

    CONSTRAINT "RegraNegocio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegraNegocioParametroNecessario" (
    "id" SERIAL NOT NULL,
    "regraId" INTEGER NOT NULL,
    "parametroNecessarioId" INTEGER NOT NULL,

    CONSTRAINT "RegraNegocioParametroNecessario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmpresaRegra" (
    "id" SERIAL NOT NULL,
    "empresaId" INTEGER NOT NULL,
    "regraId" INTEGER NOT NULL,
    "ativa" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "EmpresaRegra_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "Erp_nome_key" ON "Erp"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "NomeServico_nome_key" ON "NomeServico"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_nome_key" ON "Empresa"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_cpf_cnpj_key" ON "Empresa"("cpf_cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "ParametroPadrao_nome_erpId_key" ON "ParametroPadrao"("nome", "erpId");

-- CreateIndex
CREATE UNIQUE INDEX "ParametroNecessario_nome_erpId_key" ON "ParametroNecessario"("nome", "erpId");

-- CreateIndex
CREATE UNIQUE INDEX "ParametroPadraoParametroNecessario_parametroPadraoId_parame_key" ON "ParametroPadraoParametroNecessario"("parametroPadraoId", "parametroNecessarioId");

-- CreateIndex
CREATE UNIQUE INDEX "RegraNegocioParametroNecessario_regraId_parametroNecessario_key" ON "RegraNegocioParametroNecessario"("regraId", "parametroNecessarioId");

-- CreateIndex
CREATE UNIQUE INDEX "EmpresaRegra_empresaId_regraId_key" ON "EmpresaRegra"("empresaId", "regraId");

-- CreateIndex
CREATE INDEX "_SistemaErps_B_index" ON "_SistemaErps"("B");

-- AddForeignKey
ALTER TABLE "Documentacao" ADD CONSTRAINT "Documentacao_erpId_fkey" FOREIGN KEY ("erpId") REFERENCES "Erp"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servico" ADD CONSTRAINT "Servico_documentacaoId_fkey" FOREIGN KEY ("documentacaoId") REFERENCES "Documentacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servico" ADD CONSTRAINT "Servico_erpId_fkey" FOREIGN KEY ("erpId") REFERENCES "Erp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servico" ADD CONSTRAINT "Servico_nomeServicoId_fkey" FOREIGN KEY ("nomeServicoId") REFERENCES "NomeServico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicoDesejado" ADD CONSTRAINT "ServicoDesejado_documentacaoId_fkey" FOREIGN KEY ("documentacaoId") REFERENCES "Documentacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Empresa" ADD CONSTRAINT "Empresa_erpId_fkey" FOREIGN KEY ("erpId") REFERENCES "Erp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParametroPadrao" ADD CONSTRAINT "ParametroPadrao_erpId_fkey" FOREIGN KEY ("erpId") REFERENCES "Erp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParametroNecessario" ADD CONSTRAINT "ParametroNecessario_erpId_fkey" FOREIGN KEY ("erpId") REFERENCES "Erp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParametroPadraoParametroNecessario" ADD CONSTRAINT "ParametroPadraoParametroNecessario_parametroNecessarioId_fkey" FOREIGN KEY ("parametroNecessarioId") REFERENCES "ParametroNecessario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParametroPadraoParametroNecessario" ADD CONSTRAINT "ParametroPadraoParametroNecessario_parametroPadraoId_fkey" FOREIGN KEY ("parametroPadraoId") REFERENCES "ParametroPadrao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegraNegocio" ADD CONSTRAINT "RegraNegocio_erpId_fkey" FOREIGN KEY ("erpId") REFERENCES "Erp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegraNegocio" ADD CONSTRAINT "RegraNegocio_parametroPadraoId_fkey" FOREIGN KEY ("parametroPadraoId") REFERENCES "ParametroPadrao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegraNegocioParametroNecessario" ADD CONSTRAINT "RegraNegocioParametroNecessario_parametroNecessarioId_fkey" FOREIGN KEY ("parametroNecessarioId") REFERENCES "ParametroNecessario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegraNegocioParametroNecessario" ADD CONSTRAINT "RegraNegocioParametroNecessario_regraId_fkey" FOREIGN KEY ("regraId") REFERENCES "RegraNegocio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmpresaRegra" ADD CONSTRAINT "EmpresaRegra_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmpresaRegra" ADD CONSTRAINT "EmpresaRegra_regraId_fkey" FOREIGN KEY ("regraId") REFERENCES "RegraNegocio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SistemaErps" ADD CONSTRAINT "_SistemaErps_A_fkey" FOREIGN KEY ("A") REFERENCES "Erp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SistemaErps" ADD CONSTRAINT "_SistemaErps_B_fkey" FOREIGN KEY ("B") REFERENCES "Sistema"("id") ON DELETE CASCADE ON UPDATE CASCADE;
