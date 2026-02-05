import { jest } from "@jest/globals";

/**
 * 🔥 MOCK DO PRISMA (ESM CORRETO)
 */
const prismaMock = {
  servico: {
    findMany: jest.fn(),
  },
};

await jest.unstable_mockModule("../../prismaClient.js", () => ({
  default: prismaMock,
}));

// ⬇️ IMPORTS APÓS O MOCK
const { default: prismaClient } = await import("../../prismaClient.js");
const { default: servicoService } = await import("../servicoService.js");

describe("ServicoService - showAll", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve lançar erro se documentacaoId não for informado", async () => {
    await expect(
      servicoService.showAll({})
    ).rejects.toThrow("documentacaoId inválido ou não informado");
  });

  it("deve buscar serviços filtrando por documentacaoId", async () => {
    prismaMock.servico.findMany.mockResolvedValue([
      {
        id: 1,
        documentacaoId: 10,
        nomeServico: { nome: "Consulta ONU" },
      },
    ]);

    const result = await servicoService.showAll({ documentacaoId: 10 });

    expect(prismaMock.servico.findMany).toHaveBeenCalledWith({
      where: { documentacaoId: 10 },
      include: { nomeServico: true },
    });

    expect(result).toHaveLength(1);
    expect(result[0].documentacaoId).toBe(10);
  });
});
