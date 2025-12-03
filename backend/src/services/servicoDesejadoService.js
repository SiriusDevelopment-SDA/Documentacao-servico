import prismaClient from "../prismaClient.js";

async function create(data) {
    return await prismaClient.servicoDesejado.create({
        data: {
            descricao: data.descricao ?? null,
            documentacaoId: Number(data.documentacaoId)
        }
    });
}

async function listByDocumentacaoId(documentacaoId) {
    return await prismaClient.servicoDesejado.findMany({
        where: { documentacaoId: Number(documentacaoId) },
        orderBy: { id: "desc" }
    });
}

export default {
    create,
    listByDocumentacaoId
};
