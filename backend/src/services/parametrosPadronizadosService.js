import prismaClient from "../prismaClient.js";

async function create(data){
    return prismaClient.parametroPadrao.create({
        data:{
            nome: data.nome,
            erpId: data.erpId
        }
    })
}

async function showAll(erpId) {
  if (!erpId) {
    throw new Error("erpId é obrigatório para listar parâmetros padronizados");
  }

  return prismaClient.parametroPadrao.findMany({
    where: {
      erpId: Number(erpId),
    },
    orderBy: {
      nome: "asc",
    },
  });
}

async function showById(id){
    return prismaClient.parametroPadrao.findUnique({
        where: {id: Number(id)}
    });
}

async function update(data, id){
    return prismaClient.parametroPadrao.update({
        where: {
            id: Number(id)
        },
        data:{
            nome: data.nome
        }
    })
}

async function destroy(id) {
  return prismaClient.parametroPadrao.delete({
    where: {
      id: Number(id),
    },
  });
}

export default{
    create,
    showAll,
    showById,
    update,
    destroy
}