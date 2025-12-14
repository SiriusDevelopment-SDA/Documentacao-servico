import sistemaService from "../services/sistemaService.js";

async function create(req, res) {
  try {
    const { nome, logoUrl } = req.body;

    if (!nome) {
      return res.status(400).json({
        message: "O nome do sistema é obrigatório."
      });
    }

    const novoSistema = await sistemaService.create({
      nome,
      logoUrl
    });

    return res.status(201).json(novoSistema);

  } catch (error) {
    console.error("❌ ERRO AO CRIAR O SISTEMA:", error);
    return res.status(500).json({
      message: "Erro ao criar sistema!",
      error: error.message
    });
  }
}

async function showAll(req, res) {
    try {
        const sistemas = await sistemaService.showAll();
        return res.status(200).json(sistemas);

    } catch (error) {
        return res.status(500).json({
            message: "Erro ao listar ERPs!",
            error: error.message
        });
    }
}

async function showById(req, res) {
    try {
        const id = Number(req.params.id);

        if (isNaN(id))
            return res.status(400).json({ message: "ID inválido!" });

        const sistema = await sistemaService.showById(id);

        if (!sistema)
            return res.status(404).json({ message: "Sistema não encontrado!" });

        return res.status(200).json(sistema);

    } catch (error) {
        return res.status(500).json({
            message: "Erro ao buscar ERP!",
            error: error.message
        });
    }
}

async function getErpsBySistemaId(req, res) {
  try {
    const sistemaId = Number(req.params.id);

    const sistema = await sistemaService.getErpsBySistemaId(sistemaId);

    if (!sistema) {
      return res.status(404).json({ message: "Sistema não encontrado" });
    }

    return res.json(sistema.erps);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}



export default{
    create,
    showAll, 
    showById,
    getErpsBySistemaId
}