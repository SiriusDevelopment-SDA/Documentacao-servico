import erpService from "../services/erpService.js";

async function create(req, res) {
    try {
        const data = req.body;

        if (!data.nome) {
            return res.status(400).json({ message: "O nome do ERP é obrigatório." });
        }

        const novoErp = await erpService.create(data);

        return res.status(201).json(novoErp);

    } catch (error) {
        return res.status(500).json({ message: "Erro ao criar ERP!", error: error.message });
    }
}

async function showAll(req, res) {
    try {
        const erps = await erpService.showAll();
        return res.status(200).json(erps);
    } catch (error) {
        return res.status(500).json({ message: "Erro ao buscar os ERPs!", error: error.message });
    }
}

async function showById(req, res) {
    try {
        const { id } = req.params;

        const numericId = parseInt(id, 10);

        if (isNaN(numericId)) {
            return res.status(400).json({ message: "ID inválido!" });
        }

        const erp = await erpService.showById(numericId);

        if (!erp) {
            return res.status(404).json({ message: "ERP não encontrado!" });
        } 

        return res.status(200).json(erp);
        

    } catch (error) {
        return res.status(500).json({ message: "Erro ao buscar esse ERP!", error: error.message });
    }
}

async function destroy(req, res) {
    try {
        const { id } = req.params;

        const numericId = parseInt(id, 10);

        if (isNaN(numericId)) {
            return res.status(400).json({ message: "ID inválido!" });
        }

        const deleted = await erpService.destroy(numericId);

        if (!deleted) {
            return res.status(404).json({ message: "ERP não encontrado!" });
        }

        return res.status(204).send();

    } catch (error) {
        return res.status(500).json({
            message: "Erro ao deletar esse ERP!",
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