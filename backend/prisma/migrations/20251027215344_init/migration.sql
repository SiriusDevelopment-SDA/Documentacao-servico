-- CreateTable
CREATE TABLE "ERP" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ERP_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Documentacao" (
    "id" SERIAL NOT NULL,
    "nome_empresa" TEXT NOT NULL,
    "nome_contratante" TEXT NOT NULL,
    "documentado_por" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "numero_contrato" TEXT NOT NULL,
    "info_adicionais" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "erpId" INTEGER NOT NULL,

    CONSTRAINT "Documentacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Servico" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
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

-- CreateIndex
CREATE UNIQUE INDEX "ERP_nome_key" ON "ERP"("nome");

-- AddForeignKey
ALTER TABLE "Documentacao" ADD CONSTRAINT "Documentacao_erpId_fkey" FOREIGN KEY ("erpId") REFERENCES "ERP"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servico" ADD CONSTRAINT "Servico_documentacaoId_fkey" FOREIGN KEY ("documentacaoId") REFERENCES "Documentacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicoDesejado" ADD CONSTRAINT "ServicoDesejado_documentacaoId_fkey" FOREIGN KEY ("documentacaoId") REFERENCES "Documentacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
