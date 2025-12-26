import prismaClient from "../prismaClient.js";

/**
 * ===============================
 * CREATE
 * ===============================
 */
async function create(data) {
  if (!data.nomeServico) {
    throw new Error("nomeServico é obrigatório");
  }

  // 1️⃣ cria ou reutiliza o nome do serviço
  const nomeServico = await prismaClient.nomeServico.upsert({
    where: { nome: data.nomeServico },
    update: {},
    create: { nome: data.nomeServico },
  });

  return await prismaClient.servico.create({
    data: {
      nomeServicoId: nomeServico.id,

      descricao: data.descricao ?? null,
      instrucoes: data.instrucoes ?? null,
      ativo: data.ativo ?? true,
      sem_necessidade_api: data.sem_necessidade_api ?? false,
      endpoint: data.endpoint ?? null,
      parametros_padrao: data.parametros_padrao ?? null,
      exige_contrato: data.exige_contrato ?? false,
      exige_cpf_cnpj: data.exige_cpf_cnpj ?? false,
      exige_login_ativo: data.exige_login_ativo ?? false,
      responsavel_padrao: data.responsavel_padrao ?? null,

      // 🔗 relacionamentos
      documentacaoId: Number(data.documentacaoId),
      erpId: Number(data.erpId),
    },
    include: {
      nomeServico: true,
    },
  });
}

/**
 * ===============================
 * SHOW ALL
 * ===============================
 */
async function showAll() {
  return await prismaClient.servico.findMany({
    include: {
      nomeServico: true,
    },
  });
}

/**
 * ===============================
 * SHOW BY ID
 * ===============================
 */
async function showById(id) {
  if (!id || isNaN(id)) {
    throw new Error("ID inválido");
  }

  return await prismaClient.servico.findUnique({
    where: { id: Number(id) },
    include: {
      nomeServico: true,
    },
  });
}

/**
 * ===============================
 * DELETE
 * ===============================
 */
async function destroy(id) {
  if (!id || isNaN(id)) {
    throw new Error("ID inválido");
  }

  return await prismaClient.servico.delete({
    where: { id: Number(id) },
  });
}

/**
 * ===============================
 * UPDATE (🔥 CORREÇÃO DO ERRO 400)
 * ===============================
 */
async function update(id, data) {
  if (!id || isNaN(id)) {
    throw new Error("ID inválido");
  }

  let nomeServicoId;

  // 🔁 Atualiza nome do serviço se mudar
  if (data.nomeServico) {
    const nomeServico = await prismaClient.nomeServico.upsert({
      where: { nome: data.nomeServico },
      update: {},
      create: { nome: data.nomeServico },
    });

    nomeServicoId = nomeServico.id;
  }

  // 🧼 Monta payload seguro (sem undefined)
  const updateData = {
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
  };

  // ❌ remove undefined (causa do erro 400)
  Object.keys(updateData).forEach(
    (key) => updateData[key] === undefined && delete updateData[key]
  );

  return await prismaClient.servico.update({
    where: { id: Number(id) },
    data: updateData,
    include: {
      nomeServico: true,
    },
  });
}

/**
 * ===============================
 * EXPORT
 * ===============================
 */
export default {
  create,
  showAll,
  showById,
  destroy,
  update,
};
