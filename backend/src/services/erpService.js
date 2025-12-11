import prismaClient from "../prismaClient.js";

async function create(data) {
    return await prismaClient.erp.create({
        data: {
            nome: data.nome
        }
    });
}

async function showAll() {
    return await prismaClient.erp.findMany();
}

async function showById(id) {
    return await prismaClient.erp.findUnique({
        where: { id: Number(id) }
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
