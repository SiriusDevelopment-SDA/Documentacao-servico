import prismaClient from "../prismaClient.js";

async function create(data) {
  console.log("Recebendo dados para criar documentação:", data);
  return await prismaClient.documentacao.create({
    data: {
      nome_empresa: data.nome_empresa,
      nome_contratante: data.nome_contratante,
      documentado_por: data.documentado_por,
      data: new Date(data.data),
      numero_contrato: data.numero_contrato,
      info_adicionais: data.info_adicionais,
    }
  });
}


// Função para associar ERP à documentação após a criação
async function associateErp(documentacaoId, erpId) {
    console.log("Associando ERP com a documentação:", documentacaoId, erpId);

    return await prismaClient.documentacao.update({
        where: { id: documentacaoId },
        data: {
            erp: {
                connect: { id: erpId }  // Conectando o ERP selecionado à documentação
            }
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
  associateErp,
  showAll,
  showById,
  destroy
};
