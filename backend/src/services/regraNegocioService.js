import prismaClient from "../prismaClient.js";

async function create(body) {
  const { descricao, erpId, empresaId, setores } = body;

  // 1) Criar regra
  const regra = await prismaClient.regraNegocio.create({
    data: {
      descricao: descricao || "Regra de Negócio",
      ativa: true,
      erpId
    }
  });

  // 2) Criar SETORES + PADRÕES + NECESSÁRIOS
  for (const setor of setores) {
    const setorCriado = await prismaClient.regraSetor.create({
      data: {
        nome: setor.nome,
        regraId: regra.id
      }
    });

    // → VINCULA PADRÃO
    if (setor.parametroPadraoId) {
      await prismaClient.setorParametroPadrao.create({
        data: {
          setorId: setorCriado.id,
          padraoId: setor.parametroPadraoId
        }
      });
    }

    // → VINCULA NECESSÁRIOS
    if (Array.isArray(setor.parametrosNecessarios)) {
      await prismaClient.setorParametroNecessario.createMany({
        data: setor.parametrosNecessarios.map(necId => ({
          setorId: setorCriado.id,
          necessarioId: Number(necId)
        })),
        skipDuplicates: true
      });
    }
  }

  // 3) Vincular empresa (opcional)
  if (empresaId) {
    await prismaClient.empresaRegra.create({
      data: {
        empresaId: Number(empresaId),
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
