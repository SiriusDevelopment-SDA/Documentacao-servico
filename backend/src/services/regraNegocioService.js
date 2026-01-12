import prismaClient from "../prismaClient.js";

const regra = await prismaClient.regraNegocio.create({
  data: {
    setor: r.setor,
    descricao: r.descricao || "",
    ativa: r.ativa ?? true,
    erpId: r.erpId,
    parametroPadraoId: r.parametroPadraoId,

    // 🔹 preenchimentos obrigatórios do legado:
    parametros_padrao: "",
    parametros_obrigatorios: "",
  }
});


async function showAll() {
  return prismaClient.regraNegocio.findMany({
    include: {
      parametroPadrao: true,
      parametrosNecessarios: {
        include: {
          parametroNecessario: true,
        },
      },
      empresas: {
        include: {
          empresa: true,
        },
      },
      erp: true,
    },
  });
}

async function showById(id) {
  return prismaClient.regraNegocio.findUnique({
    where: { id: Number(id) },
    include: {
      parametroPadrao: true,
      parametrosNecessarios: {
        include: {
          parametroNecessario: true,
        },
      },
      empresas: {
        include: {
          empresa: true,
        },
      },
      erp: true,
    },
  });
}

async function update(id, data) {
  return prismaClient.regraNegocio.update({
    where: { id: Number(id) },
    data: {
      setor: data.setor,
      descricao: data.descricao,
      ativa: data.ativa,
      setores: data.setores ?? undefined,
    },
  });
}

async function destroy(id) {
  return prismaClient.regraNegocio.delete({
    where: { id: Number(id) },
  });
}

async function vincularEmpresas(regraId, empresasIds) {
  return prismaClient.empresaRegra.createMany({
    data: empresasIds.map((empresaId) => ({
      regraId: Number(regraId),
      empresaId: Number(empresaId),
    })),
    skipDuplicates: true,
  });
}

async function desvincularEmpresa(regraId, empresaId) {
  return prismaClient.empresaRegra.delete({
    where: {
      empresaId_regraId: {
        empresaId: Number(empresaId),
        regraId: Number(regraId),
      },
    },
  });
}

async function listarRegrasPorEmpresa({ empresaId, setor }) {
  return prismaClient.regraNegocio.findMany({
    where: {
      ativa: true,
      setor,
      empresas: {
        some: {
          empresaId: Number(empresaId),
          ativa: true,
        },
      },
    },
    include: {
      parametroPadrao: true,
      parametrosNecessarios: {
        include: {
          parametroNecessario: true,
        },
      },
      erp: true,
    },
  });
}

export default {
  create,
  showAll,
  showById,
  update,
  destroy,
  vincularEmpresas,
  desvincularEmpresa,
  listarRegrasPorEmpresa,
};
