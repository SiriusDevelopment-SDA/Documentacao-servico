import prismaClient from "../prismaClient.js";

async function create({ nome, sistemas }) {
  return prisma.erp.create({
    data: {
      nome,
      ativo: true,
      sistemas: {
        connect: sistemas.map(id => ({ id }))
      }
    },
    include: {
      sistemas: true
    }
  });
}
async function showAll() {
    return await prismaClient.erp.findMany({
        include: {
            sistemas: true
        }
    });
}

async function showById(id) {
    return await prismaClient.erp.findUnique({
        where: { id: Number(id) },
        include: {
            sistemas: true
        }
    });
}

async function destroy(id) {
    return await prismaClient.erp.delete({
        where: { id: Number(id) }
    });
}

async function getEmpresasByErpId(erpId) {
  return await prismaClient.documentacao.findMany({
    where: {
      erpId
    },
    select: {
      id: true,
      nome_contratante: true,
      numero_contrato: true,
      documentado_por: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
}


export default {
    create,
    showAll,
    showById,
    destroy,
    getEmpresasByErpId
};
