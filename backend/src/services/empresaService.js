import prismaClient from "../prismaClient.js";

const includeEmpresa = {
  erp: { select: { id: true, nome: true } },
};

async function create(data) {
  if (!data?.erpId) throw new Error("Campo 'erpId' é obrigatório.");

  // valida ERP existe (evita FK error genérico)
  const erp = await prismaClient.erp.findUnique({
    where: { id: Number(data.erpId) },
    select: { id: true },
  });

  if (!erp) throw new Error("ERP não encontrado.");

  return prismaClient.empresa.create({
    data: {
      nome: data.nome,
      cpf_cnpj: data.cpf_cnpj || null,
      erpId: Number(data.erpId),
    },
    include: includeEmpresa,
  });
}

async function showAll() {
  // dashboard e listagem costumam precisar do nome do ERP
  return prismaClient.empresa.findMany({
    orderBy: { createdAt: "desc" }, // agora que você tem createdAt
    include: includeEmpresa,
  });
}

async function showById(id) {
  return prismaClient.empresa.findUnique({
    where: { id: Number(id) },
    include: includeEmpresa,
  });
}

/* ======================================================
   READ LAST — Última empresa (Dashboard)
====================================================== */
async function getLast() {
  return prismaClient.empresa.findFirst({
    orderBy: { createdAt: "desc" },
    include: includeEmpresa,
  });
}

async function update(id, data) {
  return prismaClient.empresa.update({
    where: {
      id: Number(id),
    },
    data: {
      nome: data.nome,
      cpf_cnpj: data.cpf_cnpj,
      // se você quiser permitir trocar ERP:
      // ...(data.erpId !== undefined ? { erpId: Number(data.erpId) } : {}),
    },
    include: includeEmpresa,
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
  getLast, // <- NOVO
  update,
  destroy,
};
