import prismaClient from "../prismaClient.js";

async function create(body) {
  const { descricao, erpId, empresaId, setores } = body;

  // ============= 1. VALIDAR CAMPOS BÁSICOS =============

  if (!erpId) {
    throw new Error("Campo 'erpId' é obrigatório.");
  }

  if (!Array.isArray(setores) || setores.length === 0) {
    throw new Error("Envie 'setores[]' com ao menos 1 setor.");
  }

  // ============= 2. CRIAR REGRA =============

  const regra = await prismaClient.regraNegocio.create({
    data: {
      descricao: descricao || "Regra de Negócio",
      ativa: true,
      erpId,
      createdAt: new Date(),
    },
  });

  // ============= 3. CRIAR SETORES + VINCULAR PADRÕES / NECESSÁRIOS =============

  for (const setor of setores) {

    // Criar o setor da regra
    const setorCriado = await prismaClient.regraSetor.create({
      data: {
        regraId: regra.id,
        nome: setor.nome || "Setor",
      },
    });

    // ---------- PADRÕES ----------
    if (Array.isArray(setor.padroes) && setor.padroes.length > 0) {
      const padroesIDs = setor.padroes.map(Number);

      // Validar se existem no banco
      const existentes = await prismaClient.parametroPadrao.findMany({
        where: { id: { in: padroesIDs } },
        select: { id: true },
      });

      const encontrados = existentes.map(e => e.id);
      const faltando = padroesIDs.filter(id => !encontrados.includes(id));

      if (faltando.length > 0) {
        throw new Error(`Os IDs de padrões não existem: ${faltando.join(", ")}`);
      }

      await prismaClient.setorParametroPadrao.createMany({
        data: encontrados.map(id => ({
          setorId: setorCriado.id,
          padraoId: id
        }))
      });
    }

    // ---------- NECESSÁRIOS ----------
    if (Array.isArray(setor.necessarios) && setor.necessarios.length > 0) {
      const necessariosIDs = setor.necessarios.map(Number);

      // Validar existência no banco
      const existentes = await prismaClient.parametroNecessario.findMany({
        where: { id: { in: necessariosIDs } },
        select: { id: true },
      });

      const encontrados = existentes.map(e => e.id);
      const faltando = necessariosIDs.filter(id => !encontrados.includes(id));

      if (faltando.length > 0) {
        throw new Error(`Os IDs de necessários não existem: ${faltando.join(", ")}`);
      }

      await prismaClient.setorParametroNecessario.createMany({
        data: encontrados.map(id => ({
          setorId: setorCriado.id,
          necessarioId: id
        }))
      });
    }
  }

  // ============= 4. VINCULAR EMPRESA (Opcional) =============

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


/* ======================================================
   READ ALL
====================================================== */
async function showAll() {
  return prismaClient.regraNegocio.findMany({
    include: {
      empresas: { include: { empresa: true } },
      setores: {
        include: {
          padroes: { include: { padrao: true } },
          necessarios: { include: { necessario: true } }
        }
      },
      erp: true,
    }
  });
}

/* ======================================================
   READ BY ID
====================================================== */
async function showById(id) {
  return prismaClient.regraNegocio.findUnique({
    where: { id: Number(id) },
    include: {
      empresas: { include: { empresa: true } },
      setores: {
        include: {
          padroes: { include: { padrao: true } },
          necessarios: { include: { necessario: true } }
        }
      },
      erp: true,
    }
  });
}

/* ======================================================
   UPDATE (A SIMPLIFICAR DEPOIS)
====================================================== */
async function update(id, data) {
  const { descricao, ativa, setores } = data;

  return prismaClient.regraNegocio.update({
    where: { id: Number(id) },
    data: {
      setor: data.setor,
      descricao: data.descricao,
      ativa: data.ativa,
    },
  });
}

/**
 * 🔥 CORREÇÃO DO DELETE COM LIMPEZA DE PIVOTS
 */
async function destroy(id) {
  const regraId = Number(id);

  // 1️⃣ Remove vínculos com empresas
  await prismaClient.empresaRegra.deleteMany({
    where: { regraId },
  });

  // 2️⃣ Remove vínculo com pivot de parâmetros necessários
  await prismaClient.regraNegocioParametroNecessario.deleteMany({
    where: { regraId },
  });

  // 3️⃣ Remove finalmente a regra
  return prismaClient.regraNegocio.delete({
    where: { id: regraId },
  });
}

/* ======================================================
   VINCULO EMPRESA
====================================================== */
async function vincularEmpresas(regraId, empresasIds) {
  return prismaClient.empresaRegra.createMany({
    data: empresasIds.map(empId => ({
      empresaId: Number(empId),
      regraId: Number(regraId)
    })),
    skipDuplicates: true,
  });
}

/* ======================================================
   DESVINCULAR EMPRESA
====================================================== */
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

/* ======================================================
   LISTA POR EMPRESA
====================================================== */
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
      setores: {
        include: {
          padroes: { include: { padrao: true } },
          necessarios: { include: { necessario: true } }
        }
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
