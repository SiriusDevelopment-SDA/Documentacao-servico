import { jest } from "@jest/globals";
import request from "supertest";
import express from "express";

/**
 * Mock da service
 * A controller NÃO conhece prisma
 */
jest.unstable_mockModule("../../services/regraNegocioService.js", () => ({
  default: {
    showAll: jest.fn(),
    showById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    getLast: jest.fn(),
    listarRegrasPorEmpresa: jest.fn(),
    vincularEmpresas: jest.fn(),
    desvincularEmpresa: jest.fn(),
  },
}));

// imports após mock
const regraController = (await import("../regraNegocioController.js")).default;
const regraService = (await import("../../services/regraNegocioService.js")).default;

function buildApp() {
  const app = express();
  app.use(express.json());

  app.get("/regras", regraController.showAll);
  app.get("/regras/:id", regraController.showById);
  app.post("/regras", regraController.create);
  app.put("/regras/:id", regraController.update);
  app.delete("/regras/:id", regraController.destroy);

  return app;
}

describe("RegraNegocio Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("GET /regras → retorna lista de regras", async () => {
    regraService.showAll.mockResolvedValue([
      {
        id: 1,
        descricao: "Regra teste",
        setores: [],
      },
    ]);

    const app = buildApp();
    const res = await request(app).get("/regras");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].descricao).toBe("Regra teste");
  });

  test("GET /regras/:id → retorna regra quando existir", async () => {
    regraService.showById.mockResolvedValue({
      id: 10,
      descricao: "Regra específica",
      setores: [],
    });

    const app = buildApp();
    const res = await request(app).get("/regras/10");

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(10);
  });

  test("GET /regras/:id → retorna 404 quando não existir", async () => {
    regraService.showById.mockResolvedValue(null);

    const app = buildApp();
    const res = await request(app).get("/regras/999");

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Regra de negócio não encontrada");
  });

  test("POST /regras → cria regra com sucesso", async () => {
    regraService.create.mockResolvedValue({
      id: 20,
      descricao: "Nova regra",
    });

    const app = buildApp();
    const res = await request(app)
      .post("/regras")
      .send({
        descricao: "Nova regra",
        erpId: 3,
        setores: [{ nome: "Financeiro", padroes: [], necessarios: [] }],
      });

    expect(res.status).toBe(201);
    expect(res.body.id).toBe(20);
  });

  test("POST /regras → valida ausência de setores", async () => {
    const app = buildApp();
    const res = await request(app)
      .post("/regras")
      .send({ descricao: "Erro", erpId: 3 });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain("setores");
  });

  test("PUT /regras/:id → atualiza regra", async () => {
    regraService.update.mockResolvedValue({
      id: 30,
      descricao: "Atualizada",
    });

    const app = buildApp();
    const res = await request(app)
      .put("/regras/30")
      .send({ descricao: "Atualizada" });

    expect(res.status).toBe(200);
    expect(res.body.descricao).toBe("Atualizada");
  });

  test("DELETE /regras/:id → remove regra", async () => {
    regraService.destroy.mockResolvedValue();

    const app = buildApp();
    const res = await request(app).delete("/regras/40");

    expect(res.status).toBe(204);
  });
});
