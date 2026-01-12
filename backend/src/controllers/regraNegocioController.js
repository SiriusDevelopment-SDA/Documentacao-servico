import regraNegocioService from "../services/regraNegocioService.js";

/* ======================================================
   CREATE — NOVO FORMATO (UMA REGRA COM MÚLTIPLOS SETORES)
====================================================== */
async function create(req, res) {
  try {
    const body = req.body;

    if (!body.setores || !Array.isArray(body.setores) || body.setores.length === 0) {
      return res.status(400).json({
        message: "Envie 'setores[]' com ao menos 1 setor"
      });
    }

    if (!body.erpId) {
      return res.status(400).json({
        message: "Campo 'erpId' é obrigatório"
      });
    }

    if (body.empresaId && isNaN(Number(body.empresaId))) {
      return res.status(400).json({
        message: "Campo 'empresaId' deve ser numérico"
      });
    }

    const regra = await regraNegocioService.create(body);

    return res.status(201).json(regra);

  } catch (error) {
    return res.status(500).json({
      message: "Erro ao criar regra",
      error: error.message,
    });
  }
}

/* ======================================================
   READ ALL
====================================================== */
async function showAll(req, res) {
  try {
    const regras = await regraNegocioService.showAll();
    return res.status(200).json(regras);
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao buscar regras de negócio",
      error: error.message,
    });
  }
}

/* ======================================================
   READ BY ID
====================================================== */
async function showById(req, res) {
  try {
    const { id } = req.params;

    const regra = await regraNegocioService.showById(id);

    if (!regra) {
      return res.status(404).json({ message: "Regra de negócio não encontrada" });
    }

    return res.status(200).json(regra);

  } catch (error) {
    return res.status(500).json({
      message: "Erro ao buscar regra de negócio",
      error: error.message,
    });
  }
}

/* ======================================================
   UPDATE
====================================================== */
async function update(req, res) {
  try {
    const { id } = req.params;
    const { descricao, ativa, setores } = req.body;

    if (setores && (!Array.isArray(setores) || setores.length === 0)) {
      return res.status(400).json({
        message: "Se enviado, 'setores' deve ser um array com ao menos 1 item"
      });
    }

    const regra = await regraNegocioService.update(id, {
      descricao,
      ativa,
      setores
    });

    return res.status(200).json(regra);

  } catch (error) {
    return res.status(500).json({
      message: "Erro ao atualizar a regra de negócio",
      error: error.message,
    });
  }
}

/* ======================================================
   DELETE
====================================================== */
async function destroy(req, res) {
  try {
    const { id } = req.params;

    await regraNegocioService.destroy(id);

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao remover a regra de negócio",
      error: error.message,
    });
  }
}

/* ======================================================
   VÍNCULO REGRA ⇄ EMPRESA
====================================================== */
async function vincularEmpresas(req, res) {
  try {
    const { regraId } = req.params;
    const { empresas } = req.body;

    if (!Array.isArray(empresas) || empresas.length === 0) {
      return res.status(400).json({
        message: "Informe um array de IDs de empresas",
      });
    }

    await regraNegocioService.vincularEmpresas(regraId, empresas);

    return res.status(200).json({
      message: "Empresas vinculadas à regra com sucesso",
    });

  } catch (error) {
    return res.status(500).json({
      message: "Erro ao vincular empresas à regra",
      error: error.message,
    });
  }
}

/* ======================================================
   DESVINCULAR REGRA ⇄ EMPRESA
====================================================== */
async function desvincularEmpresa(req, res) {
  try {
    const { regraId, empresaId } = req.params;

    await regraNegocioService.desvincularEmpresa(regraId, empresaId);

    return res.status(200).json({
      message: "Empresa desvinculada da regra com sucesso",
    });

  } catch (error) {
    return res.status(500).json({
      message: "Erro ao desvincular empresa da regra",
      error: error.message,
    });
  }
}

/* ======================================================
   LISTAR REGRAS POR EMPRESA
====================================================== */
async function listarPorEmpresa(req, res) {
  try {
    const { empresaId } = req.params;

    if (!empresaId) {
      return res.status(400).json({
        message: "Informe o ID da empresa"
      });
    }

    const regras = await regraNegocioService.listarRegrasPorEmpresa({
      empresaId,
    });

    return res.status(200).json(regras);

  } catch (error) {
    return res.status(500).json({
      message: "Erro ao listar regras por empresa",
      error: error.message,
    });
  }
}

export default {
  create,
  showAll,
  showById,
  update,
  destroy,
  vincularEmpresas,
  desvincularEmpresa,
  listarPorEmpresa,
};
