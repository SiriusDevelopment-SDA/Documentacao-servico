import prismaClient from "../prismaClient.js";

/**
 * CREATE — retrocompatível com formatos:
 * 1) { regras: [...] }
 * 2) { ...regra }
 */
async function create(body) {
  let { regras } = body;

  // Se vier uma regra única, transforma em array
  if (!regras && body && typeof body === "object") {
    regras = [body];
  }

  if (!Array.isArray(regras) || regras.length === 0) {
    throw new Error("Envie ao menos um item em 'regras'");
  }

  const criadas = [];

  for (const r of regras) {
    // cria regra base com campos obrigatórios
    const regra = await prismaClient.regraNegocio.create({
      data: {
        setor: r.setor,
        descricao: r.descricao || "",
        ativa: r.ativa ?? true,
        erpId: r.erpId,
        parametroPadraoId: r.parametroPadraoId,

        // 🔹 LEGADO obrigatório (seu Prisma não aceita nulo)
        parametros_padrao: JSON.stringify([r.parametroPadraoId] || []),
        parametros_obrigatorios: JSON.stringify(r.parametrosNecessarios || []),
      }
    });

    // cria pivot se houver parâmetros necessários
    if (Array.isArray(r.parametrosNecessarios) && r.parametrosNecessarios.length > 0) {
      await prismaClient.regraNegocioParametroNecessario.createMany({
        data: r.parametrosNecessarios.map((necId) => ({
          regraId: regra.id,
          parametroNecessarioId: Number(necId),
        })),
        skipDuplicates: true,
      });
    }

    criadas.push(regra);
  }

  return criadas;
}


/**
 * READ ALL — inclui tudo necessário para o front
 */
async function showAll() {
  return prismaClient.regraNegocio.findMany({
    include: {
      parametroPadrao: true,
      parametrosNecessarios: {
        include: { parametroNecessario: true }
      },
      empresas: {
        include: { empresa: true }
      },
      erp: true,
    },
  });
}

/**
 * READ BY ID — inclui pivot + empresa + erp
 */
async function showById(id) {
  return prismaClient.regraNegocio.findUnique({
    where: { id: Number(id) },
    include: {
      parametroPadrao: true,
      parametrosNecessarios: {
        include: { parametroNecessario: true }
      },
      empresas: {
        include: { empresa: true }
      },
      erp: true,
    },
  });
}

/**
 * UPDATE (mantém compatibilidade)
 */
async function update(id, data) {
  return prismaClient.regraNegocio.update({
    where: { id: Number(id) },
    data: {
      setor: data.setor,
      descricao: data.descricao,
      ativa: data.ativa,
      setores: data.setores ?? undefined, // opcional JSON
    },
  });
}

/**
 * DELETE
 */
async function destroy(id) {
  return prismaClient.regraNegocio.delete({
    where: { id: Number(id) },
  });
}

/**
 * VINCULAR REGRA ⇄ EMPRESAS
 */
async function vincularEmpresas(regraId, empresasIds) {
  return prismaClient.empresaRegra.createMany({
    data: empresasIds.map((empresaId) => ({
      regraId: Number(regraId),
      empresaId: Number(empresaId),
    })),
    skipDuplicates: true,
  });
}

/**
 * DESVINCULAR REGRA ⇄ EMPRESA
 */
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

/**
 * LISTAR POR EMPRESA
 */
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
        include: { parametroNecessario: true }
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
