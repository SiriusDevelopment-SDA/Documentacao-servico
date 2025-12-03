import prismaClient from "../prismaClient.js";

async function create(data) {
    return await prismaClient.servico.create({
        data: {
            nome: data.nome,
            descricao: data.descricao,
            instrucoes: data.instrucoes,
            ativo: data.ativo,
            sem_necessidade_api: data.sem_necessidade_api,
            endpoint: data.endpoint,
            parametros_padrao: data.parametros_padrao,
            exige_contrato: data.exige_contrato,
            exige_cpf_cnpj: data.exige_cpf_cnpj,
            exige_login_ativo: data.exige_login_ativo,
            responsavel_padrao: data.responsavel_padrao,
            documentacao: {
                connect: { id: Number(data.documentacao.connect.id) }
            }
        }
    });
}

async function showAll() {
    return await prismaClient.servico.findMany();
}

async function showById(id) {
    return await prismaClient.servico.findUnique({
        where: { id: Number(id) }
    });
}

async function destroy(id) {
    return await prismaClient.servico.delete({
        where: { id: Number(id) }
    });
}


async function update(id, data) {
    return await prismaClient.servico.update({
        where: { id: Number(id) },
        data: {
            nome: data.nome,
            descricao: data.descricao,
            instrucoes: data.instrucoes,
            ativo: data.ativo,
            sem_necessidade_api: data.sem_necessidade_api,
            endpoint: data.endpoint,
            parametros_padrao: data.parametros_padrao,
            exige_contrato: data.exige_contrato,
            exige_cpf_cnpj: data.exige_cpf_cnpj,
            exige_login_ativo: data.exige_login_ativo,
            responsavel_padrao: data.responsavel_padrao
        }
    });
}

export default {
    create,
    showAll,
    showById,
    destroy,
    update
};