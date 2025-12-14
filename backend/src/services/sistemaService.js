import prismaClient from "../prismaClient.js";

async function create(data) {
    return await prismaClient.sistema.create({
        data: {
            nome: data.nome
        }
    })
}

async function showAll() {
    return await prismaClient.sistema.findMany();
}

async function showById(id) {
    return await prismaClient.sistema.findUnique({
        where: { id }
    });
}

export default {
    create,
    showAll,
    showById
}