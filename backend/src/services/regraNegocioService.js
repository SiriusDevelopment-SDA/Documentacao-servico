import prismaClient from "../prismaClient.js";

async function create(body) {
  const { descricao, erpId, empresaId, setores } = body;

  // 1) Criar regra base
  const regra = await prismaClient.regraNegocio.create({
    data: {
      descricao: descricao || "Regra automática",
      ativa: true,
      erpId: Number(erpId),
    }
  });

  // 2) Criar setores vinculados
  for (const setor of setores) {
    const setorCriado = await prismaClient.regraSetor.create({
      data: {
        nome: setor.nome,
        regraId: regra.id
      }
    });

    // 3) Vincular padroes (ParametroPadrao)
    if (Array.isArray(setor.padroes)) {
      await prismaClient.setorParametroPadrao.createMany({
        data: setor.padroes.map(id => ({
          setorId: setorCriado.id,
          padraoId: Number(id)
        }))
      });
    }

    // 4) Vincular necessarios (ParametroNecessario)
    if (Array.isArray(setor.necessarios)) {
      await prismaClient.setorParametroNecessario.createMany({
        data: setor.necessarios.map(id => ({
          setorId: setorCriado.id,
          necessarioId: Number(id)
        }))
      });
    }
  }

  // 5) Vincular empresa → regra (se enviado)
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
