import prismaClient from "../prismaClient.js";

async function create(data) {
  // 1️⃣ cria ou reutiliza o nome do serviço
  const nomeServico = await prismaClient.nomeServico.upsert({
    where: { nome: data.nomeServico },
    update: {},
    create: { nome: data.nomeServico },
  });

  // 2️⃣ cria o serviço vinculado ao nome
  return await prismaClient.servico.create({
    data: {
      nomeServicoId: nomeServico.id,

      descricao: data.descricao,
      instrucoes: data.instrucoes,
      ativo: data.ativo ?? true,
      sem_necessidade_api: data.sem_necessidade_api,
      endpoint: data.endpoint,
      parametros_padrao: data.parametros_padrao,
      exige_contrato: data.exige_contrato,
      exige_cpf_cnpj: data.exige_cpf_cnpj,
      exige_login_ativo: data.exige_login_ativo,
      responsavel_padrao: data.responsavel_padrao,

      // 🔗 relacionamentos
      documentacaoId: Number(data.documentacaoId),
      erpId: Number(data.erpId),
    },
    include: {
      nomeServico: true,
    },
  });
}

async function showAll() {
  return await prismaClient.servico.findMany({
    include: {
      nomeServico: true,
    },
  });
}

async function showById(id) {
  return await prismaClient.servico.findUnique({
    where: { id: Number(id) },
    include: {
      nomeServico: true,
    },
  });
}

async function destroy(id) {
  return await prismaClient.servico.delete({
    where: { id: Number(id) },
  });
}

async function update(id, data) {
  // ⚠️ Se o nome mudar, atualiza relacionamento
  let nomeServicoId;

  if (data.nomeServico) {
    const nomeServico = await prismaClient.nomeServico.upsert({
      where: { nome: data.nomeServico },
      update: {},
      create: { nome: data.nomeServico },
    });

    nomeServicoId = nomeServico.id;
  }

  return await prismaClient.servico.update({
    where: { id: Number(id) },
    data: {
      ...(nomeServicoId && { nomeServicoId }),

      descricao: data.descricao,
      instrucoes: data.instrucoes,
      ativo: data.ativo,
      sem_necessidade_api: data.sem_necessidade_api,
      endpoint: data.endpoint,
      parametros_padrao: data.parametros_padrao,
      exige_contrato: data.exige_contrato,
      exige_cpf_cnpj: data.exige_cpf_cnpj,
      exige_login_ativo: data.exige_login_ativo,
      responsavel_padrao: data.responsavel_padrao,
    },
    include: {
      nomeServico: true,
    },
  });
}

export default {
  create,
  showAll,
  showById,
  destroy,
  update,
};
