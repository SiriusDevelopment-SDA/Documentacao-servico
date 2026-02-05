import prismaClient from "../prismaClient.js";


function normalizeServico(servico) {
  if (!servico) return servico;

  return {
    ...servico,

    // ✅ mantém o objeto completo do relacionamento
    nomeServico: servico.nomeServico ?? null,

    // ✅ string auxiliar (opcional, mas útil)
    nomeServicoNome: servico.nomeServico?.nome ?? null,
  };
}

/**
 * ===============================
 * CREATE
 * ===============================
 */
async function create(data) {
  if (!data.nomeServico) {
    throw new Error("nomeServico é obrigatório");
  }

  // 🔁 cria ou reutiliza nome do serviço
  const nomeServico = await prismaClient.nomeServico.upsert({
    where: { nome: data.nomeServico },
    update: {},
    create: { nome: data.nomeServico },
  });

  const servico = await prismaClient.servico.create({
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

  return normalizeServico(servico);
}

/**
 * ===============================
 * SHOW ALL
 * ===============================
 */
async function showAll({documentacaoId}) {
  if(!documentacaoId || isNaN(documentacaoId)){
    throw new Error("documentacaoId inválido ou não informado");
  }

  const servicos = await prismaClient.servico.findMany({
    where: {
      documentacaoId: Number(documentacaoId)
    },
    include: {
      nomeServico: true,
    },
  });

  return servicos.map(normalizeServico);
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

  const servico = await prismaClient.servico.findUnique({
    where: { id: Number(id) },
    include: {
      nomeServico: true,
    },
  });

  return normalizeServico(servico);
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
 * UPDATE
 * ===============================
 */
async function update(id, data) {
  if (!id || isNaN(id)) {
    throw new Error("ID inválido");
  }

  let nomeServicoId;

  // 🔁 Atualiza nome do serviço se enviado
  if (data.nomeServico) {
    const nomeServico = await prismaClient.nomeServico.upsert({
      where: { nome: data.nomeServico },
      update: {},
      create: { nome: data.nomeServico },
    });

    nomeServicoId = nomeServico.id;
  }

  // 🧼 payload seguro (remove undefined)
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

  Object.keys(updateData).forEach(
    (key) => updateData[key] === undefined && delete updateData[key]
  );

  const servico = await prismaClient.servico.update({
    where: { id: Number(id) },
    data: updateData,
    include: {
      nomeServico: true,
    },
  });

  return normalizeServico(servico);
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
