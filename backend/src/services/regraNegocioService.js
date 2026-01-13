import prismaClient from "../prismaClient.js";

async function create(body) {
  const { descricao, erpId, empresaId, setores } = body;

  const regra = await prismaClient.regraNegocio.create({
    data: {
      descricao,
      ativa: true,
      erpId
    }
  });

  for (const setor of setores) {

    // cria o setor
    const setorCriado = await prisma.regraSetor.create({
      data: {
        nome: setor.nome,
        regraId: regra.id
      }
    });

    // vincula padronizados
    if (Array.isArray(setor.padroes)) {
      await prisma.setorParametroPadrao.createMany({
        data: setor.padroes.map(id => ({
          setorId: setorCriado.id,
          padraoId: id
        }))
      });
    }

    // vincula necessários
    if (Array.isArray(setor.necessarios)) {
      await prisma.setorParametroNecessario.createMany({
        data: setor.necessarios.map(id => ({
          setorId: setorCriado.id,
          necessarioId: id
        }))
      });
    }
  }

  // vincula empresa opcionalmente
  if (empresaId) {
    await prisma.empresaRegra.create({
      data: {
        empresaId,
        regraId: regra.id
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
