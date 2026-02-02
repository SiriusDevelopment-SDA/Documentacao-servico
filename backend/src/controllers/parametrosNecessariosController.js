import parametrosNecessariosService from "../services/parametrosNecessariosService.js";

async function create(req, res) {
  try {
    const { nome, erpId } = req.body;

    if (!nome) {
      return res.status(400).json({ message: "O campo nome é obrigatório." });
    }

    const novoParametro = await parametrosNecessariosService.create({
      nome,
      erpId,
    });

    return res.status(201).json(novoParametro);
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao criar o parâmetro!",
      error: error.message,
    });
  }
}

async function showAll(req, res) {
  try {
    const { erpId } = req.query;

    if (!erpId) {
      return res.status(400).json({
        message: "erpId é obrigatório",
      });
    }

    const parametros =
      await parametrosNecessariosService.showAll(erpId);

    return res.status(200).json(parametros);
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao buscar os parâmetros!",
      error: error.message,
    });
  }
}

async function showById(req, res) {
  try {
    const { id } = req.params;

    const parametro = await parametrosNecessariosService.showById(id);

    if (!parametro) {
      return res.status(404).json({ message: "Parâmetro não encontrado!" });
    }

    return res.status(200).json(parametro);
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao buscar o parâmetro!",
      error: error.message,
    });
  }
}

async function update(req, res) {
  try {
    const { id } = req.params;
    const { nome } = req.body;

    if (!nome) {
      return res.status(400).json({ message: "O campo nome é obrigatório." });
    }

    const parametroAtualizado =
      await parametrosNecessariosService.update({ nome }, id);

    return res.status(200).json(parametroAtualizado);
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao atualizar o parâmetro!",
      error: error.message,
    });
  }
}

async function destroy(req, res) {
  try {
    const { id } = req.params;

    await parametrosNecessariosService.destroy(id);

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao remover o parâmetro!",
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
};