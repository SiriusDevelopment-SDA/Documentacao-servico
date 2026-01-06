import prismaClient from "../prismaClient.js";

async function create(data) {
    return prismaClient.empresa.create({
        data: {
            nome: data.nome,
            cpf_cnpj: data.cpf_cnpj,
            erpId: data.erpId,
        }
    })
}

async function showAll() {
    return prismaClient.empresa.findMany();
}

async function showById(id) {
    return prismaClient.empresa.findUnique({
        where: { id: Number(id) }
    })
}

async function update(id, data) {
    return prismaClient.empresa.update({
        where: {
            id: Number(id),
        },
        data: {
            nome: data.nome,
            cpf_cnpj: data.cpf_cnpj
        },
    });
}

async function destroy(id) {
  return prismaClient.empresa.delete({
    where: {
      id: Number(id),
    },
  });
}

export default {
  create,
  showAll,
  showById,
  update,
  destroy,
};