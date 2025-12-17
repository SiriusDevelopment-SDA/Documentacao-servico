import servicoService from "../services/servicoService.js";

async function create(req, res) {
  try {
    const data = req.body;

    // ===== VALIDACOES MINIMAS =====
    if (!data.nomeServico)
      return res.status(400).json({ message: "O campo 'nomeServico' é obrigatório." });

    if (!data.descricao)
      return res.status(400).json({ message: "O campo 'descricao' é obrigatório." });

    if (!data.documentacaoId)
      return res.status(400).json({ message: "O campo 'documentacaoId' é obrigatório." });

    if (!data.erpId)
      return res.status(400).json({ message: "O campo 'erpId' é obrigatório." });

    // ===== VALIDA PARAMETROS PADRAO =====
    if (data.parametros_padrao && typeof data.parametros_padrao !== "object") {
      return res.status(400).json({
        message: "'parametros_padrao' deve ser um JSON válido.",
      });
    }

    const novoServico = await servicoService.create({
      nomeServico: data.nomeServico,
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
      documentacaoId: data.documentacaoId,
      erpId: data.erpId,
    });

    return res.status(201).json(novoServico);

  } catch (error) {
    console.error("❌ ERRO AO CRIAR SERVIÇO:", error);
    return res.status(500).json({
      message: "Erro ao criar o serviço!",
      error: error.message,
    });
  }
}

async function showAll(req, res) {
  try {
    const servicos = await servicoService.showAll();
    return res.status(200).json(servicos);
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao buscar os serviços!",
      error: error.message,
    });
  }
}

async function showById(req, res) {
  try {
    const id = Number(req.params.id);

    if (isNaN(id))
      return res.status(400).json({ message: "ID inválido!" });

    const servico = await servicoService.showById(id);

    if (!servico)
      return res.status(404).json({ message: "Serviço não encontrado!" });

    return res.status(200).json(servico);

  } catch (error) {
    return res.status(500).json({
      message: "Erro ao buscar esse serviço!",
      error: error.message,
    });
  }
}

async function destroy(req, res) {
  try {
    const id = Number(req.params.id);

    if (isNaN(id))
      return res.status(400).json({ message: "ID inválido!" });

    await servicoService.destroy(id);
    return res.status(204).send();

  } catch (error) {
    if (error.code === "P2025")
      return res.status(404).json({ message: "Serviço não encontrado!" });

    return res.status(500).json({
      message: "Erro ao deletar serviço!",
      error: error.message,
    });
  }
}

async function update(req, res) {
  try {
    const id = Number(req.params.id);
    const data = req.body;

    if (isNaN(id))
      return res.status(400).json({ message: "ID inválido!" });

    if (!data.nomeServico)
      return res.status(400).json({ message: "O campo 'nomeServico' é obrigatório." });

    if (!data.descricao)
      return res.status(400).json({ message: "O campo 'descricao' é obrigatório." });

    const servicoAtualizado = await servicoService.update(id, {
      nomeServico: data.nomeServico,
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
    });

    return res.status(200).json(servicoAtualizado);

  } catch (error) {
    return res.status(500).json({
      message: "Erro ao atualizar o serviço!",
      error: error.message,
    });
  }
}

export default {
  create,
  showAll,
  showById,
  destroy,
  update,
};
