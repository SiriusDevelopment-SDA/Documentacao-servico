import nomeServicoService from "../services/nomeServicoService.js";

async function create(req, res) {
    try {
        const data = req.body;

        if (!data.nome)
            return res.status(400).json({ message: "O campo 'nome' é obrigatório." });

        const novoNomeServico = await nomeServicoService.create(data);
        return res.status(201).json(novoNomeServico);

    } catch (error) {
        console.error("❌ ERRO AO CRIAR SERVIÇO:", error);
        return res.status(500).json({
            message: "Erro ao criar o serviço!",
            error: error.message
        });
    }
}

async function showAll(req, res) {
    try {
        const nomeServicos = await nomeServicoService.showAll();
        return res.status(200).json(nomeServicos);
    } catch (error) {
        return res.status(500).json({
            message: "Erro ao buscar os serviços!",
            error: error.message
        });
    }
}

async function showById(req, res) {
    try {
        const id = Number(req.params.id);

        if (isNaN(id))
            return res.status(400).json({ message: "ID inválido!" });

        const nomeServico = await nomeServicoService.showById(id);

        if (!nomeServico)
            return res.status(404).json({ message: "Serviço não encontrado!" });

        return res.status(200).json(nomeServico);

    } catch (error) {
        return res.status(500).json({
            message: "Erro ao buscar esse serviço!",
            error: error.message
        });
    }
}

async function destroy(req, res) {
    try {
        const id = Number(req.params.id);

        if (isNaN(id))
            return res.status(400).json({ message: "ID inválido!" });

        await nomeServicoService.destroy(id);
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
        const id = Number(req.params.id);
        const data = req.body;

        if (isNaN(id))
            return res.status(400).json({ message: "ID inválido!" });

        if (!data.nome)
            return res.status(400).json({ message: "O campo 'nome' é obrigatório." });

        const nomeServicoAtualizado = await nomeServicoService.update(id, data);
        return res.status(200).json(nomeServicoAtualizado);

    } catch (error) {
        return res.status(500).json({
            message: "Erro ao atualizar o nome do serviço!",
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
