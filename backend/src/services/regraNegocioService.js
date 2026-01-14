import prismaClient from "../prismaClient.js";

const includeRegraCompleta = {
  empresas: { include: { empresa: true } },
  setores: {
    include: {
      padroes: { include: { padrao: true } },
      necessarios: { include: { necessario: true } },
    },
  },
  erp: true,
};

async function create(body) {
  const { descricao, erpId, empresaId, setores } = body;

  if (!erpId) throw new Error("Campo 'erpId' é obrigatório.");
  if (!Array.isArray(setores) || setores.length === 0) {
    throw new Error("Envie 'setores[]' com ao menos 1 setor.");
  }

  // Transação para evitar regra criada parcialmente
  return prismaClient.$transaction(async (tx) => {
    // (Opcional, mas útil) garante que ERP existe
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
        // createdAt já tem default no schema, pode omitir
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
          new Set(setor.padroes.map(Number).filter((n) => Number.isFinite(n)))
        );

        // (Recomendado) validar se pertencem ao ERP da regra
        const existentes = await tx.parametroPadrao.findMany({
          where: { id: { in: padroesIDs }, erpId: Number(erpId) },
          select: { id: true },
        });

        const encontrados = existentes.map((e) => e.id);
        const faltando = padroesIDs.filter((id) => !encontrados.includes(id));

        if (faltando.length > 0) {
          throw new Error(`Os IDs de padrões não existem (ou não pertencem ao ERP): ${faltando.join(", ")}`);
        }

        await tx.setorParametroPadrao.createMany({
          data: encontrados.map((id) => ({
            setorId: setorCriado.id,
            padraoId: id,
          })),
          skipDuplicates: true,
        });
      }

      // ---------- NECESSÁRIOS ----------
      if (Array.isArray(setor.necessarios) && setor.necessarios.length > 0) {
        const necessariosIDs = Array.from(
          new Set(setor.necessarios.map(Number).filter((n) => Number.isFinite(n)))
        );

        const existentes = await tx.parametroNecessario.findMany({
          where: { id: { in: necessariosIDs }, erpId: Number(erpId) },
          select: { id: true },
        });

        const encontrados = existentes.map((e) => e.id);
        const faltando = necessariosIDs.filter((id) => !encontrados.includes(id));

        if (faltando.length > 0) {
          throw new Error(`Os IDs de necessários não existem (ou não pertencem ao ERP): ${faltando.join(", ")}`);
        }

        await tx.setorParametroNecessario.createMany({
          data: encontrados.map((id) => ({
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

    // Retorna completo (melhor para o frontend)
    return tx.regraNegocio.findUnique({
      where: { id: regra.id },
      include: includeRegraCompleta,
    });
  });
}

/* ======================================================
   READ ALL
====================================================== */
async function showAll() {
  return prismaClient.regraNegocio.findMany({
    orderBy: { createdAt: "desc" },
    include: includeRegraCompleta,
  });
}

/* ======================================================
   READ BY ID
====================================================== */
async function showById(id) {
  return prismaClient.regraNegocio.findUnique({
    where: { id: Number(id) },
    include: includeRegraCompleta,
  });
}

/* ======================================================
   READ LAST (Dashboard)
====================================================== */
async function getLast() {
  return prismaClient.regraNegocio.findFirst({
    orderBy: { createdAt: "desc" },
    include: {
      empresas: { include: { empresa: true } },
      setores: {
        include: {
          padroes: { include: { padrao: true } },
          necessarios: { include: { necessario: true } },
        },
      },
      erp: true,
    },
  });
}


/* ======================================================
   UPDATE (mantém seu código como está)
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
        const idNum = Number(setor?.id);
        const temIdValido = Number.isFinite(idNum);
        const temNomeValido =
          typeof setor?.nome === "string" && setor.nome.trim().length > 0;

        if (!temIdValido && !temNomeValido) {
          throw new Error(
            "Cada item de 'setores[]' deve conter 'id' (numérico) ou 'nome' (string)."
          );
        }

        let setorId;

        if (temIdValido) {
          const setorExiste = await tx.regraSetor.findFirst({
            where: { id: idNum, regraId },
            select: { id: true },
          });

          if (!setorExiste) {
            throw new Error(
              `Setor (regraSetor) ${idNum} não pertence à regra ${regraId}.`
            );
          }

          setorId = idNum;

          if (temNomeValido) {
            await tx.regraSetor.update({
              where: { id: setorId },
              data: { nome: setor.nome.trim() },
            });
          }
        } else {
          const nomeSetor = setor.nome.trim();

          const existente = await tx.regraSetor.findFirst({
            where: {
              regraId,
              nome: { equals: nomeSetor, mode: "insensitive" },
            },
            select: { id: true },
          });

          if (existente) {
            setorId = existente.id;
          } else {
            const criado = await tx.regraSetor.create({
              data: {
                regraId,
                nome: nomeSetor,
              },
              select: { id: true },
            });
            setorId = criado.id;
          }
        }

        if (Array.isArray(setor.padroes)) {
          const padroesIDs = Array.from(
            new Set(
              setor.padroes.map(Number).filter((n) => Number.isFinite(n))
            )
          );

          // aqui você pode manter sua validação atual ou reforçar por ERP (eu recomendo)
          await tx.setorParametroPadrao.deleteMany({ where: { setorId } });

          if (padroesIDs.length > 0) {
            await tx.setorParametroPadrao.createMany({
              data: padroesIDs.map((pid) => ({ setorId, padraoId: pid })),
              skipDuplicates: true,
            });
          }
        }

        if (Array.isArray(setor.necessarios)) {
          const necessariosIDs = Array.from(
            new Set(
              setor.necessarios.map(Number).filter((n) => Number.isFinite(n))
            )
          );

          await tx.setorParametroNecessario.deleteMany({ where: { setorId } });

          if (necessariosIDs.length > 0) {
            await tx.setorParametroNecessario.createMany({
              data: necessariosIDs.map((nid) => ({ setorId, necessarioId: nid })),
              skipDuplicates: true,
            });
          }
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
   DELETE (mantém como está)
====================================================== */
async function destroy(id) {
  const regraId = Number(id);

  const setores = await prismaClient.regraSetor.findMany({
    where: { regraId },
    select: { id: true },
  });

  for (const setor of setores) {
    await prismaClient.setorParametroPadrao.deleteMany({
      where: { setorId: setor.id },
    });

    await prismaClient.setorParametroNecessario.deleteMany({
      where: { setorId: setor.id },
    });
  }

  await prismaClient.regraSetor.deleteMany({
    where: { regraId },
  });

  await prismaClient.empresaRegra.deleteMany({
    where: { regraId },
  });

  return prismaClient.regraNegocio.delete({
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
  getLast, // <- NOVO
  update,
  destroy,
  desvincularEmpresa,
  listarRegrasPorEmpresa,
};
