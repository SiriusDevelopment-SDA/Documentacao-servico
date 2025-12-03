import * as servicoDesejadoService from "../services/servicoDesejadoService.js";

async function create(req, res) {
    try {
        const { descricao, documentacaoId } = req.body;

        if (!documentacaoId) {
            return res.status(400).json({ error: "documentacaoId é obrigatório." });
        }

        const novo = await servicoDesejadoService.create({
            descricao,
            documentacaoId
        });

        return res.status(201).json({
            message: "Serviço desejado salvo com sucesso!",
            data: novo
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao salvar serviço desejado." });
    }
}

async function list(req, res) {
    try {
        const { documentacaoId } = req.params;

        const lista = await servicoDesejadoService.listByDocumentacaoId(documentacaoId);

        return res.json(lista);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao listar serviços desejados." });
    }
}

export default {
    create,
    list
};
