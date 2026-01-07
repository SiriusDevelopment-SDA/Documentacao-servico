import prismaClient from "../prismaClient.js";

async function create(data){
    return prismaClient.parametroNecessario.create({
        data:{
            nome: data.nome,
            erpId: data.erpId
        }
    })
}

async function showAll(){
    return prismaClient.parametroNecessario.findMany();
}

async function showById(id){
    return prismaClient.parametroNecessario.findUnique({
        where: {id: Number(id)}
    });
}

async function update(data, id){
    return prismaClient.parametroNecessario.update({
        where: {
            id: Number(id)
        },
        data:{
            nome: data.nome
        }
    })
}

async function destroy(id) {
  return prismaClient.parametroNecessario.delete({
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