import prismaClient from "../prismaClient.js";

/**
 * CREATE — agrupa múltiplos setores em uma única regra
 */
async function create(body) {
  const { descricao, erpId, empresaId, setores } = body;

  if (!erpId || !Array.isArray(setores) || setores.length === 0) {
    throw new Error("Campos obrigatórios: erpId, setores[]");
  }

  // 🔹 Cria regra base (1 por empresa)
  const regra = await prismaClient.regraNegocio.create({
    data: {
      descricao: descricao || "Regra de Negócio",
      ativa: true,
      erpId,

      // 🔹 LEGADO obrigatório (mantido)
      parametros_padrao: "[]",
      parametros_obrigatorios: "[]",

      // 🔹 Novo campo JSON contendo todos os setores
      setores: setores,
    }
  });

  // 🔹 Vincula setores ao pivot (RegraNecessário)
  for (const setor of setores) {
    if (Array.isArray(setor.parametrosNecessarios)) {
      await prismaClient.regraNegocioParametroNecessario.createMany({
        data: setor.parametrosNecessarios.map(necId => ({
          regraId: regra.id,
          parametroNecessarioId: Number(necId),
        })),
        skipDuplicates: true,
      });
    }
  }

  // 🔹 Vincula regra à empresa (se enviado)
  if (empresaId) {
    await prismaClient.empresaRegra.create({
      data: {
        empresaId: Number(empresaId),
        regraId: regra.id,
      }
    });
  }

  return regra;
}

/**
 * READ ALL — retorna a regra com seus setores
 */
async function showAll() {
  return prismaClient.regraNegocio.findMany({
    include: {
      empresas: { include: { empresa: true } },
      parametrosNecessarios: { include: { parametroNecessario: true } },
      erp: true
    }
  });
}

async function showById(id) {
  return prismaClient.regraNegocio.findUnique({
    where: { id: Number(id) },
    include: {
      empresas: { include: { empresa: true } },
      parametrosNecessarios: { include: { parametroNecessario: true } },
      erp: true
    }
  });
}

async function update(id, data) {
  return prismaClient.regraNegocio.update({
    where: { id: Number(id) },
    data: {
      descricao: data.descricao,
      ativa: data.ativa,
      setores: data.setores ?? undefined // nova forma
    }
  });
}

async function destroy(id) {
  return prismaClient.regraNegocio.delete({
    where: { id: Number(id) }
  });
}

async function vincularEmpresas(regraId, empresasIds) {
  return prismaClient.empresaRegra.createMany({
    data: empresasIds.map(empId => ({
      empresaId: Number(empId),
      regraId: Number(regraId)
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

async function listarRegrasPorEmpresa({ empresaId }) {
  return prismaClient.regraNegocio.findMany({
    where: {
      empresas: {
        some: {
          empresaId: Number(empresaId),
          ativa: true,
        },
      },
    },
    include: {
      empresas: { include: { empresa: true } },
      parametrosNecessarios: { include: { parametroNecessario: true } },
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
