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

      const encontrados = existentes.map((e) => e.id);
      const faltando = padroesIDs.filter((id) => !encontrados.includes(id));

      if (faltando.length > 0) {
        throw new Error(
          `Os IDs de padrões não existem: ${faltando.join(", ")}`
        );
      }

      await prismaClient.setorParametroPadrao.createMany({
        data: encontrados.map((id) => ({
          setorId: setorCriado.id,
          padraoId: id,
        })),
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

      const encontrados = existentes.map((e) => e.id);
      const faltando = necessariosIDs.filter((id) => !encontrados.includes(id));

      if (faltando.length > 0) {
        throw new Error(
          `Os IDs de necessários não existem: ${faltando.join(", ")}`
        );
      }

      await prismaClient.setorParametroNecessario.createMany({
        data: encontrados.map((id) => ({
          setorId: setorCriado.id,
          necessarioId: id,
        })),
      });
    }
  }

  // ============= 4. VINCULAR EMPRESA (Opcional) =============

  if (empresaId) {
    await prismaClient.empresaRegra.create({
      data: {
        empresaId: Number(empresaId),
        regraId: regra.id,
      },
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
          necessarios: { include: { necessario: true } },
        },
      },
      erp: true,
    },
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
          necessarios: { include: { necessario: true } },
        },
      },
      erp: true,
    },
  });
}

/* ======================================================
   UPDATE (CORRIGIDO: SETORES + PADRÕES + NECESSÁRIOS)
====================================================== */
/* ======================================================
   UPDATE (SETOR POR ID OU NOME + ATUALIZA PIVÔS)
====================================================== */
async function update(id, data) {
  const regraId = Number(id);
  const { descricao, ativa, setores } = data;

  return prismaClient.$transaction(async (tx) => {
    // 1) Atualiza campos básicos da regra (somente se vierem no payload)
    await tx.regraNegocio.update({
      where: { id: regraId },
      data: {
        ...(descricao !== undefined ? { descricao } : {}),
        ...(ativa !== undefined ? { ativa } : {}),
      },
    });

    // 2) Atualiza setores + pivôs (se vier setores no payload)
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

        // 2.1) Resolve setorId:
        // - se veio id válido, garante que pertence à regra
        // - se veio só nome, busca na regra; se não existir, cria
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

          // opcional: atualiza nome se veio
          if (temNomeValido) {
            await tx.regraSetor.update({
              where: { id: setorId },
              data: { nome: setor.nome.trim() },
            });
          }
        } else {
          // veio só nome (mock)
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

        // ---------- PADRÕES (limpa e recria) ----------
        if (Array.isArray(setor.padroes)) {
          const padroesIDs = Array.from(
            new Set(
              setor.padroes
                .map(Number)
                .filter((n) => Number.isFinite(n))
            )
          );

          // valida IDs se tiver algum
          if (padroesIDs.length > 0) {
            const existentes = await tx.parametroPadrao.findMany({
              where: { id: { in: padroesIDs } },
              select: { id: true },
            });

            const encontrados = existentes.map((e) => e.id);
            const faltando = padroesIDs.filter((pid) => !encontrados.includes(pid));

            if (faltando.length > 0) {
              throw new Error(`Os IDs de padrões não existem: ${faltando.join(", ")}`);
            }
          }

          await tx.setorParametroPadrao.deleteMany({ where: { setorId } });

          if (padroesIDs.length > 0) {
            await tx.setorParametroPadrao.createMany({
              data: padroesIDs.map((pid) => ({ setorId, padraoId: pid })),
              skipDuplicates: true,
            });
          }
        }

        // ---------- NECESSÁRIOS (limpa e recria) ----------
        if (Array.isArray(setor.necessarios)) {
          const necessariosIDs = Array.from(
            new Set(
              setor.necessarios
                .map(Number)
                .filter((n) => Number.isFinite(n))
            )
          );

          if (necessariosIDs.length > 0) {
            const existentes = await tx.parametroNecessario.findMany({
              where: { id: { in: necessariosIDs } },
              select: { id: true },
            });

            const encontrados = existentes.map((e) => e.id);
            const faltando = necessariosIDs.filter((nid) => !encontrados.includes(nid));

            if (faltando.length > 0) {
              throw new Error(
                `Os IDs de necessários não existem: ${faltando.join(", ")}`
              );
            }
          }

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

    // 3) Retorna a regra completa (como showById)
    return tx.regraNegocio.findUnique({
      where: { id: regraId },
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
  });
}


/**
 * 🔥 CORREÇÃO DO DELETE COM LIMPEZA DE PIVOTS
 */
async function destroy(id) {
  const regraId = Number(id);

  // 1. Buscar setores vinculados à regra
  const setores = await prismaClient.regraSetor.findMany({
    where: { regraId },
    select: { id: true },
  });

  // 2. Deletar parâmetros dos setores
  for (const setor of setores) {
    await prismaClient.setorParametroPadrao.deleteMany({
      where: { setorId: setor.id },
    });

    await prismaClient.setorParametroNecessario.deleteMany({
      where: { setorId: setor.id },
    });
  }

  // 3. Deletar setores
  await prismaClient.regraSetor.deleteMany({
    where: { regraId },
  });

  // 4. Deletar vínculos com empresas
  await prismaClient.empresaRegra.deleteMany({
    where: { regraId },
  });

  // 5. Deletar a regra
  return prismaClient.regraNegocio.delete({
    where: { id: regraId },
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
          necessarios: { include: { necessario: true } },
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
  desvincularEmpresa,
  listarRegrasPorEmpresa,
};
