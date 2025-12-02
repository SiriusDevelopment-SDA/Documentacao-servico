import prismaClient from "../prismaClient.js";

async function create(data) {
    return await prismaClient.eRP.create({
        data: { nome: data.nome }
    });
}

async function showAll() {
    return await prismaClient.eRP.findMany();
}

async function showById(id) {
    return await prismaClient.eRP.findUnique({
        where: { id: Number(id) }
    });
}

async function destroy(id) {
    return await prismaClient.eRP.delete({
        where: { id: Number(id) }
    });
}

export default {
    create,
    showAll,
    showById,
    destroy
};
