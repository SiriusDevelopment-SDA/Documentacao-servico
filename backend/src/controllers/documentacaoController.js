import documentacaoService from "../services/documentacaoService.js";

async function create(req, res) {
  try {
    const data = req.body;

    console.log("Dados recebidos para criação:", data);

    if (!data.nome_empresa || !data.nome_contratante || !data.documentado_por || !data.data) {
      return res.status(400).json({ message: "Dados obrigatórios não foram fornecidos." });
    }

    // Criação da documentação
    const novaDocumentacao = await documentacaoService.create(data);

    console.log("Documentação criada com sucesso:", novaDocumentacao);
    return res.status(201).json(novaDocumentacao);

  } catch (error) {
    console.error("ERRO:", error);
    return res.status(500).json({ message: "Erro ao criar documentação!", error: error.message });
  }
}

// Função para associar ERP após criação
async function associateErp(req, res) {
  try {
    const { id } = req.params; // Documentação ID
    const { erpId } = req.body; // ERP ID que vem do frontend

    // Verifica se o ERP está presente
    if (!erpId) {
      return res.status(400).json({ message: "ERP não foi especificado!" });
    }

    // Chama a função do service para associar o ERP
    const updatedDocumentacao = await documentacaoService.associateErp(id, erpId);

    return res.status(200).json(updatedDocumentacao);
  } catch (error) {
    console.error("Erro ao associar ERP:", error);
    return res.status(500).json({ message: "Erro ao associar ERP!", error: error.message });
  }
}



async function showAll(req, res) {
    try {
        const documentacoes = await documentacaoService.showAll();
        return res.status(200).json(documentacoes);
    } catch (error) {
        return res.status(500).json({ message: "Erro ao buscar as documentações!", error: error.message });
    }
}

async function showById(req, res) {
    try {
        const { id } = req.params;

        const numericId = parseInt(id, 10);

        if (isNaN(numericId)) {
            return res.status(400).json({ message: "ID inválido!" });
        }

        const documentacao = await documentacaoService.showById(numericId);
        if (!documentacao) {
            return res.status(404).json({ message: "Documentação não encontrada!" });
        } else {
            return res.status(200).json(documentacao);
        }
    } catch (error) {
        return res.status(500).json({ message: "Erro ao buscar essa documentação!", error: error.message });
    }
}

async function destroy(req, res) {
    try {
        const { id } = req.params;

        const numericId = parseInt(id, 10);

        if (isNaN(numericId)) {
            return res.status(400).json({ message: "ID inválido!" });
        }

        const deleted = await documentacaoService.destroy(numericId);

        if (!deleted) {
            return res.status(404).json({ message: "Documentação não encontrada!" });
        }

        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({
            message: "Erro ao deletar essa documentação!",
            error: error.message
        });
    }
}



export default {
    create,
    associateErp, // Exporte a função para associar o ERP
    showAll,
    showById,
    destroy
};
