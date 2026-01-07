import prismaClient from "../prismaClient.js";

async function create(data){
    return prismaClient.parametroPadrao.create({
        data:{
            nome: data.nome,
            erpId: data.erpId
        }
    })
}

async function showAll(){
    return prismaClient.parametroPadrao.findMany();
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