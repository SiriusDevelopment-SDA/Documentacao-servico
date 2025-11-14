import documentacaoService from "../services/documentacaoService.js";

async function create(req, res) {
    try {
        const data = req.body;

        if (!data.nome_empresa || !data.nome_contratante || !data.documentado_por || !data.data || !data.numero_contrato) {
            return res.status(400).json({ message: "Todos os campos são obrigatórios." });
        }

        const novaDocumentacao = await documentacaoService.create(data);

        return res.status(201).json(novaDocumentacao);

    } catch (error) {
        return res.status(500).json({ message: "Erro ao criar documentação!", error: error.message });
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
    showAll,
    showById,
    destroy
};