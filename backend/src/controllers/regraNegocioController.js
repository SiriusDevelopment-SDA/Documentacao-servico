import regraNegocioService from "../services/regraNegocioService.js";

/* ======================================================
   CREATE
====================================================== */

async function create(req, res) {
  try {
    const { erpId, setor, descricao, parametroPadraoId } = req.body;

    if (!erpId || !setor || !descricao || !parametroPadraoId) {
      return res.status(400).json({
        message:
          "Campos obrigatórios: erpId, setor, descricao, parametroPadraoId",
      });
    }

    const regra = await regraNegocioService.create({
      erpId,
      setor,
      descricao,
      parametroPadraoId,
    });

    return res.status(201).json(regra);
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao criar a regra de negócio",
      error: error.message,
    });
  }
}

/* ======================================================
   READ
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

async function showById(req, res) {
  try {
    const { id } = req.params;

    const regra = await regraNegocioService.showById(id);

    if (!regra) {
      return res.status(404).json({
        message: "Regra de negócio não encontrada",
      });
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
    const { setor, descricao, ativa } = req.body;

    const regra = await regraNegocioService.update(id, {
      setor,
      descricao,
      ativa,
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
    const { setor } = req.query;

    const regras = await regraNegocioService.listarRegrasPorEmpresa({
      empresaId,
      setor,
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
