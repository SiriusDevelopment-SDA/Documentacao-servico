import prismaClient from "../prismaClient.js";

async function create(data) {
    const { nome, sistemas } = data;

    if (!nome) {
        throw new Error("Nome do ERP é obrigatório");
    }

    if (!sistemas || !Array.isArray(sistemas) || sistemas.length === 0) {
        throw new Error("Informe ao menos um sistema para o ERP");
    }

    return await prismaClient.erp.create({
        data: {
            nome,
            sistemas: {
                connect: sistemas.map(id => ({ id }))
            }
        },
        include: {
            sistemas: true
        }
    });
}

async function showAll() {
    return await prismaClient.erp.findMany({
        include: {
            sistemas: true
        }
    });
}

async function showById(id) {
    return await prismaClient.erp.findUnique({
        where: { id: Number(id) },
        include: {
            sistemas: true
        }
    });
}

async function destroy(id) {
    return await prismaClient.erp.delete({
        where: { id: Number(id) }
    });
}

export default {
    create,
    showAll,
    showById,
    destroy
};
