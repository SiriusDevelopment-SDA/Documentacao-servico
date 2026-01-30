import prismaClient from "../prismaClient.js";

/* ======================================================
   INCLUDE AJUSTADO (PADRÃO → NECESSÁRIOS)
   ⚠️ NÃO remove tabelas, só muda o include
====================================================== */
const includeRegraCompleta = {
  empresas: { include: { empresa: true } },
  setores: {
    include: {
      padroes: {
        include: {
          padrao: {
            include: {
              parametrosNecessarios: {
                include: {
                  parametroNecessario: true,
                },
                orderBy: { ordem: "asc" },
              },
            },
          },
        },
      },
      // ❌ REMOVIDO DO INCLUDE (causava confusão no front)
      // necessarios: { include: { necessario: true } },
    },
  },
  erp: true,
};

/* ======================================================
   CREATE (INALTERADO)
====================================================== */
async function create(body) {
  const { descricao, erpId, empresaId, setores } = body;

  if (!erpId) throw new Error("Campo 'erpId' é obrigatório.");
  if (!Array.isArray(setores) || setores.length === 0) {
    throw new Error("Envie 'setores[]' com ao menos 1 setor.");
  }

  return prismaClient.$transaction(async (tx) => {
    const erp = await tx.erp.findUnique({
      where: { id: Number(erpId) },
      select: { id: true },
    });
    if (!erp) throw new Error("ERP não encontrado.");

    const regra = await tx.regraNegocio.create({
      data: {
        descricao: descricao || "Regra de Negócio",
        ativa: true,
        erpId: Number(erpId),
      },
    });

    for (const setor of setores) {
      const setorCriado = await tx.regraSetor.create({
        data: {
          regraId: regra.id,
          nome: setor.nome || "Setor",
        },
      });

      // ---------- PADRÕES ----------
      if (Array.isArray(setor.padroes) && setor.padroes.length > 0) {
        const padroesIDs = Array.from(
          new Set(setor.padroes.map(Number).filter(Number.isFinite))
        );

        await tx.setorParametroPadrao.createMany({
          data: padroesIDs.map((id) => ({
            setorId: setorCriado.id,
            padraoId: id,
          })),
          skipDuplicates: true,
        });
      }

      // ---------- NECESSÁRIOS ----------
      // ⚠️ MANTIDO (não quebra nada existente)
      if (Array.isArray(setor.necessarios) && setor.necessarios.length > 0) {
        const necessariosIDs = Array.from(
          new Set(setor.necessarios.map(Number).filter(Number.isFinite))
        );

        await tx.setorParametroNecessario.createMany({
          data: necessariosIDs.map((id) => ({
            setorId: setorCriado.id,
            necessarioId: id,
          })),
          skipDuplicates: true,
        });
      }
    }

    if (empresaId) {
      await tx.empresaRegra.create({
        data: {
          empresaId: Number(empresaId),
          regraId: regra.id,
        },
      });
    }

    return tx.regraNegocio.findUnique({
      where: { id: regra.id },
      include: includeRegraCompleta,
    });
  });
}

/* ======================================================
   READS
====================================================== */
async function showAll() {
  return prismaClient.regraNegocio.findMany({
    orderBy: { createdAt: "desc" },
    include: includeRegraCompleta,
  });
}

async function showById(id) {
  return prismaClient.regraNegocio.findUnique({
    where: { id: Number(id) },
    include: includeRegraCompleta,
  });
}

async function getLast() {
  return prismaClient.regraNegocio.findFirst({
    orderBy: { createdAt: "desc" },
    include: includeRegraCompleta,
  });
}

/* ======================================================
   UPDATE / DELETE / OTHERS
   👉 TUDO MANTIDO IGUAL (sem risco)
====================================================== */

async function update(id, data) {
  const regraId = Number(id);
  const { descricao, ativa, setores } = data;

  return prismaClient.$transaction(async (tx) => {
    await tx.regraNegocio.update({
      where: { id: regraId },
      data: {
        ...(descricao !== undefined ? { descricao } : {}),
        ...(ativa !== undefined ? { ativa } : {}),
      },
    });

    if (Array.isArray(setores)) {
      for (const setor of setores) {
        let setorId = Number(setor.id);

        await tx.setorParametroPadrao.deleteMany({ where: { setorId } });

        if (Array.isArray(setor.padroes)) {
          await tx.setorParametroPadrao.createMany({
            data: setor.padroes.map((pid) => ({
              setorId,
              padraoId: Number(pid),
            })),
            skipDuplicates: true,
          });
        }

        if (Array.isArray(setor.necessarios)) {
          await tx.setorParametroNecessario.deleteMany({ where: { setorId } });

          await tx.setorParametroNecessario.createMany({
            data: setor.necessarios.map((nid) => ({
              setorId,
              necessarioId: Number(nid),
            })),
            skipDuplicates: true,
          });
        }
      }
    }

    return tx.regraNegocio.findUnique({
      where: { id: regraId },
      include: includeRegraCompleta,
    });
  });
}

async function destroy(id) {
  const regraId = Number(id);

  await prismaClient.regraNegocio.delete({
    where: { id: regraId },
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
    include: includeRegraCompleta,
  });
}

export default {
  create,
  showAll,
  showById,
  getLast,
  update,
  destroy,
  desvincularEmpresa,
  listarRegrasPorEmpresa,
};
