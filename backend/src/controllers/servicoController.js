import servicoService from "../services/servicoService.js";

async function create(req, res) {
    try {
        const data = req.body;

        if (!data.nome) {
            return res.status(400).json({ message: "O campo 'nome' é obrigatório." });
        }

        if (!data.descricao) {
            return res.status(400).json({ message: "O campo 'descricao' é obrigatório." });
        }

        if (!data.endpoint) {
            return res.status(400).json({ message: "O campo 'endpoint' é obrigatório." });
        }

        if (data.parametros_padrao === undefined || data.parametros_padrao === null) {
            return res.status(400).json({ message: "O campo 'parametros_padrao' é obrigatório." });
        }

        if (typeof data.parametros_padrao !== "object") {
            return res.status(400).json({ message: "'parametros_padrao' deve ser um JSON válido." });
        }

        if (Object.keys(data.parametros_padrao).length === 0) {
            return res.status(400).json({ message: "'parametros_padrao' não pode ser vazio." });
        }

        const novoServico = await servicoService.create(data);
        return res.status(201).json(novoServico);

    } catch (error) {
        return res.status(500).json({
            message: "Erro ao criar o serviço!",
            error: error.message
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
            error: error.message
        });
    }
}

async function showById(req, res) {
    try {
        const numericId = Number(req.params.id);

        if (isNaN(numericId))
            return res.status(400).json({ message: "ID inválido!" });

        const servico = await servicoService.showById(numericId);

        if (!servico)
            return res.status(404).json({ message: "Serviço não encontrado!" });

        return res.status(200).json(servico);

    } catch (error) {
        return res.status(500).json({
            message: "Erro ao buscar esse serviço!",
            error: error.message
        });
    }
}

async function destroy(req, res) {
    try {
        const numericId = Number(req.params.id);

        if (isNaN(numericId))
            return res.status(400).json({ message: "ID inválido!" });

        await servicoService.destroy(numericId);

        return res.status(204).send();

    } catch (error) {
        if (error.code === "P2025")
            return res.status(404).json({ message: "Serviço não encontrado!" });

        return res.status(500).json({
            message: "Erro ao deletar serviço!",
            error: error.message
        });
    }
}

async function update(req, res) {
    try {
        const numericId = Number(req.params.id);

        if (isNaN(numericId))
            return res.status(400).json({ message: "ID inválido!" });

        const data = req.body;

        if (!data.nome)
            return res.status(400).json({ message: "O campo 'nome' é obrigatório." });

        if (!data.descricao)
            return res.status(400).json({ message: "O campo 'descricao' é obrigatório." });

        if (!data.sem_necessidade_api && !data.endpoint)
            return res.status(400).json({ message: "O endpoint é obrigatório quando depende de API." });

        const servicoAtualizado = await servicoService.update(numericId, data);
        return res.status(200).json(servicoAtualizado);

    } catch (error) {
        return res.status(500).json({
            message: "Erro ao atualizar o serviço!",
            error: error.message
        });
    }
}

export default {
    create,
    showAll,
    showById,
    destroy,
    update
};
