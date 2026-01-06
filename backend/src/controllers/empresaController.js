import empresaService from "../services/empresaService.js";

async function create(req, res) {
    try {
        const data = req.body;

        if (!data.nome) {
            return res.status(400).json({ message: "O campo nome é obrigatório." });
        }

        const novaEmpresa = await empresaService.create({
            nome: nome,
            cpf_cnpj: cpf_cnpj
        })
        return res.status(201).json(novaEmpresa);

    } catch (error) {
        return res.status(500).json({
            message: "Erro ao criar empresa!",
            error: error.message
        });
    }
}

async function showAll(req, res) {
    try {
        const empresas = await empresaService.showAll();
        return res.status(200).json(empresas);

    } catch (error) {
        return res.status(500).json({
            message: "Erro ao buscar as empresas!",
            error: error.message
        });
    }
}

async function showById(req, res) {
  try {
    const { id } = req.params;
    const empresa = await empresaService.showById(id);

    if (!empresa) {
      return res.status(404).json({ error: 'Empresa não encontrada' });
    }

    return res.json(empresa);
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Erro ao buscar empresa',
    });
  }
}

async function update(req, res) {
  try {
    const { id } = req.params;
    const empresa = await empresaService.update(id, req.body);
    return res.json(empresa);
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Erro ao atualizar empresa',
    });
  }
}

async function destroy(req, res) {
  try {
    const { id } = req.params;
    await empresaService.destroy(id);
    return res.status(204).send();
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Erro ao remover empresa',
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