import prismaClient from "../prismaClient.js";

/* ======================================================
   INCLUDE CORRETO (PADRÃO → NECESSÁRIOS)
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
    },
  },
  erp: true,
};

/* ======================================================
   CREATE
====================================================== */
async function create(body) {
  const { descricao, erpId, empresaId, setores } = body;

  if (!erpId) throw new Error("Campo 'erpId' é obrigatório.");
  if (!Array.isArray(setores) || setores.length === 0) {
    throw new Error("Envie 'setores[]' com ao menos 1 setor.");
  }

  return prismaClient.$transaction(async (tx) => {
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
          nome: setor.nome,
        },
      });

      if (Array.isArray(setor.padroes) && setor.padroes.length > 0) {
        const padroesIDs = [...new Set(setor.padroes.map(Number))];

        await tx.setorParametroPadrao.createMany({
          data: padroesIDs.map((padraoId) => ({
            setorId: setorCriado.id,
            padraoId,
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
const showAll = () =>
  prismaClient.regraNegocio.findMany({
    orderBy: { createdAt: "desc" },
    include: includeRegraCompleta,
  });

const showById = (id) =>
  prismaClient.regraNegocio.findUnique({
    where: { id: Number(id) },
    include: includeRegraCompleta,
  });

const getLast = () =>
  prismaClient.regraNegocio.findFirst({
    orderBy: { createdAt: "desc" },
    include: includeRegraCompleta,
  });

/* ======================================================
   UPDATE
====================================================== */
async function update(id, data) {
  const regraId = Number(id);
  const { descricao, ativa, setores } = data;

  return prismaClient.$transaction(async (tx) => {
    await tx.regraNegocio.update({
      where: { id: regraId },
      data: {
        ...(descricao !== undefined && { descricao }),
        ...(ativa !== undefined && { ativa }),
      },
    });

    if (Array.isArray(setores)) {
      for (const setor of setores) {
        const setorId = Number(setor.id);

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
      }
    }

    return tx.regraNegocio.findUnique({
      where: { id: regraId },
      include: includeRegraCompleta,
    });
  });
}

/* ======================================================
   DELETE / OTHERS
====================================================== */
const destroy = (id) =>
  prismaClient.regraNegocio.delete({
    where: { id: Number(id) },
  });

const desvincularEmpresa = (regraId, empresaId) =>
  prismaClient.empresaRegra.delete({
    where: {
      empresaId_regraId: {
        empresaId: Number(empresaId),
        regraId: Number(regraId),
      },
    },
  });

const listarRegrasPorEmpresa = ({ empresaId }) =>
  prismaClient.regraNegocio.findMany({
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
