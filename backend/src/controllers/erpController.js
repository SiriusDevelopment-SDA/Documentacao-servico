import erpService from "../services/erpService.js";

async function create(req, res) {
    try {
        const { nome } = req.body;

        if (!nome || nome.trim() === "") {
            return res.status(400).json({ message: "O nome do ERP é obrigatório." });
        }

        const novoErp = await erpService.create({ nome });
        return res.status(201).json(novoErp);

    } catch (error) {
        console.error("❌ ERRO AO CRIAR ERP:", error);
        return res.status(500).json({
            message: "Erro ao criar ERP!",
            error: error.message
        });
    }
}

async function showAll(req, res) {
    try {
        const erps = await erpService.showAll();
        return res.status(200).json(erps);

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

        const erp = await erpService.showById(id);

        if (!erp)
            return res.status(404).json({ message: "ERP não encontrado!" });

        return res.status(200).json(erp);

    } catch (error) {
        return res.status(500).json({
            message: "Erro ao buscar ERP!",
            error: error.message
        });
    }
}

async function destroy(req, res) {
    try {
        const id = Number(req.params.id);

        if (isNaN(id))
            return res.status(400).json({ message: "ID inválido!" });

        await erpService.destroy(id);

        return res.status(204).send();

    } catch (error) {
        if (error.code === "P2025")
            return res.status(404).json({ message: "ERP não encontrado!" });

        return res.status(500).json({
            message: "Erro ao deletar ERP!",
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
