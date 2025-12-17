import prismaClient from "../prismaClient.js";

async function create(data) {
    return await prismaClient.nomeServico.create({
        data: {
            nome: data.nome
        }
    })
}

async function showAll() {
    return await prismaClient.nomeServico.findMany();
}

async function showById(id){
    return await prismaClient.nomeServico.findUnique({
        where: { id: Number(id) }
    })
}

async function destroy(id) {
  return await prismaClient.nomeServico.delete({
    where: { id: Number(id) }
  });
}

async function update(id, data) {
  return await prismaClient.nomeServico.update({
    where: { id: Number(id) },
    data: {
      nome: data.nome,
    }
  });
}

export default{
    create,
    showAll,
    showById,
    destroy,
    update
}