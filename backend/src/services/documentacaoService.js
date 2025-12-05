import prismaClient from "../prismaClient.js";

async function create(data) {
    return await prismaClient.documentacao.create({
        data: {
            nome_empresa: data.nome_empresa,
            nome_contratante: data.nome_contratante,
            documentado_por: data.documentado_por,
            data: new Date(data.data),
            numero_contrato: data.numero_contrato,
            info_adicionais: data.info_adicionais
        }
    });
}

async function showAll() {
    return await prismaClient.documentacao.findMany();
}

async function showById(id) {
    return await prismaClient.documentacao.findUnique({
        where: { id }
    });
}

async function destroy(id) {
    return await prismaClient.documentacao.delete({ where: { id } });
}

export default {
    create,
    showAll,
    showById,
    destroy
};