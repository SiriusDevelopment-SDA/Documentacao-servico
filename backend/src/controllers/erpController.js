import erpService from "../services/erpService.js";

import prisma from "../prismaClient.js";

async function create(req, res) {
  try {
    const { nome, sistemas } = req.body;

    console.log("Payload recebido no ERP:", req.body);

    if (!nome || !Array.isArray(sistemas) || sistemas.length === 0) {
      return res.status(400).json({
        error: "Informe nome do ERP e ao menos um sistema"
      });
    }

    const erp = await prisma.erp.create({
      data: {
        nome,
        sistemas: {
          connect: sistemas.map(id => ({
            id: Number(id)
          }))
        }
      }
    });

    return res.json(erp);
  } catch (error) {
    console.error("❌ ERRO AO CRIAR ERP:", error);
    return res.status(500).json({
      error: "Erro interno ao criar ERP"
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
