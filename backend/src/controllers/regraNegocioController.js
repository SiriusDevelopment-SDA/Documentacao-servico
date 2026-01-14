import regraNegocioService from "../services/regraNegocioService.js";

/* ======================================================
   CREATE — Cria Regra com múltiplos setores
====================================================== */
async function create(req, res) {
  try {
    const body = req.body;

    if (!body.setores || !Array.isArray(body.setores) || body.setores.length === 0) {
      return res.status(400).json({ message: "Envie 'setores[]' com ao menos 1 setor" });
    }

    if (!body.erpId) {
      return res.status(400).json({ message: "Campo 'erpId' é obrigatório" });
    }

    if (body.empresaId && isNaN(Number(body.empresaId))) {
      return res.status(400).json({ message: "Campo 'empresaId' deve ser numérico" });
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
   READ ALL — retorna regra + setores
====================================================== */
async function showAll(req, res) {
  try {
    // A service já faz include
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
   READ BY ID — retorna regra + setores
====================================================== */
async function showById(req, res) {
  try {
    const { id } = req.params;

    // A service já faz include
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
   UPDATE — Atualiza regra + setores + parâmetros (pivôs)
   Aceita:
   setores[] = [{ id?, nome?, padroes?: number[], necessarios?: number[] }]
====================================================== */
async function update(req, res) {
  try {
    const { id } = req.params;
    const { descricao, ativa, setores } = req.body;

    // Validações leves (evita payload quebrado)
    if (setores !== undefined) {
      if (!Array.isArray(setores)) {
        return res.status(400).json({
          message: "Campo 'setores' deve ser um array.",
        });
      }

      for (const s of setores) {
        const idNum = Number(s?.id);
        const temIdValido = Number.isFinite(idNum);
        const temNomeValido = typeof s?.nome === "string" && s.nome.trim().length > 0;

        // IMPORTANTE: permite setor novo (mock) vindo sem id, desde que tenha nome
        if (!temIdValido && !temNomeValido) {
          return res.status(400).json({
            message: "Cada item de 'setores[]' deve conter 'id' (numérico) ou 'nome' (string).",
          });
        }

        if (s.padroes !== undefined && !Array.isArray(s.padroes)) {
          return res.status(400).json({
            message: "Campo 'setores[].padroes' deve ser um array de IDs.",
          });
        }

        if (s.necessarios !== undefined && !Array.isArray(s.necessarios)) {
          return res.status(400).json({
            message: "Campo 'setores[].necessarios' deve ser um array de IDs.",
          });
        }
      }
    }

    const regra = await regraNegocioService.update(id, {
      descricao,
      ativa,
      setores, // <- ESSENCIAL para atualizar/crear pivôs
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
   VINCULAR EMPRESAS
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
   DESVINCULAR EMPRESA
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
        message: "Informe o ID da empresa",
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
