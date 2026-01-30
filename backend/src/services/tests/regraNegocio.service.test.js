import { jest } from "@jest/globals";

/**
 * MOCK DO PRISMA CLIENT
 * ⚠️ obrigatório em ESM usar unstable_mockModule
 */
jest.unstable_mockModule("../../prismaClient.js", () => ({
  default: {
    regraNegocio: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
    },
  },
}));

// IMPORTS APÓS MOCK
const prismaClient = (await import("../../prismaClient.js")).default;
const regraService = (await import("../regraNegocioService.js")).default;

describe("RegraNegocio Service – retorno de parâmetros necessários por padrão", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("showAll deve retornar parâmetros necessários dentro de cada parâmetro padronizado", async () => {
    prismaClient.regraNegocio.findMany.mockResolvedValue([
      {
        id: 24,
        descricao: "Regra automática",
        setores: [
          {
            id: 23,
            nome: "Financeiro",
            padroes: [
              {
                id: 47,
                padrao: {
                  id: 28,
                  nome: "2 via da fatura",
                  parametrosNecessarios: [
                    {
                      parametroNecessario: {
                        id: 4,
                        nome: "Id de serviço",
                      },
                    },
                    {
                      parametroNecessario: {
                        id: 5,
                        nome: "cpf_cnpj",
                      },
                    },
                  ],
                },
              },
              {
                id: 48,
                padrao: {
                  id: 5,
                  nome: "Desbloqueio de confiança",
                  parametrosNecessarios: [
                    {
                      parametroNecessario: {
                        id: 18,
                        nome: "servico_id",
                      },
                    },
                  ],
                },
              },
            ],
          },
        ],
      },
    ]);

    const result = await regraService.showAll();

    expect(result).toHaveLength(1);

    const setor = result[0].setores[0];
    expect(setor.nome).toBe("Financeiro");

    // 2 via da fatura
    expect(setor.padroes[0].padrao.nome).toBe("2 via da fatura");
    expect(
      setor.padroes[0].padrao.parametrosNecessarios.map(
        (p) => p.parametroNecessario.nome
      )
    ).toEqual(["Id de serviço", "cpf_cnpj"]);

    // Desbloqueio de confiança
    expect(setor.padroes[1].padrao.nome).toBe("Desbloqueio de confiança");
    expect(
      setor.padroes[1].padrao.parametrosNecessarios.map(
        (p) => p.parametroNecessario.nome
      )
    ).toEqual(["servico_id"]);
  });

  test("showById não deve retornar parâmetros necessários soltos por setor", async () => {
    prismaClient.regraNegocio.findUnique.mockResolvedValue({
      id: 24,
      setores: [
        {
          id: 23,
          nome: "Financeiro",
          necessarios: undefined,
        },
      ],
    });

    const result = await regraService.showById(24);

    expect(result.setores[0].necessarios).toBeUndefined();
  });
});
