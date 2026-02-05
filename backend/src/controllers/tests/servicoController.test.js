import { jest } from "@jest/globals";
import request from "supertest";
import express from "express";

/**
 * 🔥 MOCK DO SERVICE (ESM CORRETO)
 */
const servicoServiceMock = {
  showAll: jest.fn(),
};

await jest.unstable_mockModule("../../services/servicoService.js", () => ({
  default: servicoServiceMock,
}));

// ⬇️ IMPORTS APÓS MOCK
const { default: servicoController } = await import("../servicoController.js");

const app = express();
app.use(express.json());
app.get("/servico", servicoController.showAll);

describe("ServicoController - showAll", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar 400 se documentacaoId não for informado", async () => {
    const response = await request(app).get("/servico");

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "documentacaoId é obrigatório para listar serviços."
    );
  });

  it("deve retornar 200 e listar serviços da documentação", async () => {
    servicoServiceMock.showAll.mockResolvedValue([
      { id: 1, documentacaoId: 5 },
    ]);

    const response = await request(app)
      .get("/servico")
      .query({ documentacaoId: 5 });

    expect(response.status).toBe(200);
    expect(servicoServiceMock.showAll).toHaveBeenCalledWith({
      documentacaoId: 5,
    });
    expect(response.body).toHaveLength(1);
  });

  it("deve retornar 500 se o service lançar erro", async () => {
    servicoServiceMock.showAll.mockRejectedValue(
      new Error("Erro interno")
    );

    const response = await request(app)
      .get("/servico")
      .query({ documentacaoId: 10 });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Erro ao buscar os serviços!");
  });
});
