import dotenv from "dotenv";
import request from "supertest";
import mongoose from "mongoose";
import app from "../src/server.js";
import User from "../src/models/User.js";

import {
  jest,
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterAll,
} from "@jest/globals";

dotenv.config({ path: new URL("../.env.test", import.meta.url).pathname });

jest.setTimeout(20000);

beforeAll(async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error(
      "❌ MONGO_URI não carregado. Verifique seu arquivo .env.test"
    );
  }
  const mongoTestUri = uri.replace("Teste", "TesteJest");
  await mongoose.connect(mongoTestUri);
});

beforeEach(async () => {
  await User.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

// helper para extrair mensagem de erro independente do formato
const getErrorMessage = (body) => {
  if (body.message) return body.message;
  if (body.error) return body.error;
  if (Array.isArray(body.details) && body.details.length > 0) {
    return body.details.join(" ");
  }
  return "";
};

describe("API /api/users", () => {
  it("deve criar um novo usuário", async () => {
    const res = await request(app)
      .post("/api/users")
      .send({
        name: "Teste",
        email: `teste${Date.now()}@email.com`,
        idade: 30,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.name).toBe("Teste");
    expect(res.body.idade).toBe(30);
  });

  it("deve listar usuários", async () => {
    await User.create({ name: "Maria", email: "maria@email.com", idade: 25 });

    const res = await request(app).get("/api/users");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe("Maria");
    expect(res.body[0].idade).toBe(25);
  });

  it("deve buscar usuário por ID", async () => {
    const user = await User.create({
      name: "João",
      email: "joao@email.com",
      idade: 40,
    });

    const res = await request(app).get(`/api/users/${user._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("João");
    expect(res.body.idade).toBe(40);
  });

  it("deve atualizar usuário", async () => {
    const user = await User.create({
      name: "Ana",
      email: "ana@email.com",
      idade: 20,
    });

    const res = await request(app)
      .put(`/api/users/${user._id}`)
      .send({ idade: 22 });

    expect(res.statusCode).toBe(200);
    expect(res.body.idade).toBe(22);
  });

  it("deve deletar usuário", async () => {
    const user = await User.create({
      name: "Carlos",
      email: "carlos@email.com",
      idade: 35,
    });

    const res = await request(app).delete(`/api/users/${user._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Usuário deletado com sucesso");
  });

  // --- Casos de erro ---

  it("não deve criar usuário duplicado", async () => {
    const email = `duplicado${Date.now()}@email.com`;
    await User.create({ name: "Primeiro", email, idade: 30 });

    const res = await request(app).post("/api/users").send({
      name: "Segundo",
      email,
      idade: 25,
    });

    expect(res.statusCode).toBe(400);
    // agora pega a mensagem genérica de duplicidade
    expect(getErrorMessage(res.body)).toMatch(/duplicado/i);
  });

  it("não deve criar usuário com dados inválidos", async () => {
    const res = await request(app).post("/api/users").send({
      name: "",
      email: "invalido",
    });

    expect(res.statusCode).toBe(400);
    expect(getErrorMessage(res.body)).toMatch(/obrigatório|inválido|válido/i);
  });

  it("não deve buscar usuário com ID inválido", async () => {
    const res = await request(app).get("/api/users/123");

    expect(res.statusCode).toBe(400);
    expect(getErrorMessage(res.body)).toMatch(/inválido/i);
  });

  it("não deve atualizar usuário inexistente", async () => {
    const idFake = new mongoose.Types.ObjectId();

    const res = await request(app)
      .put(`/api/users/${idFake}`)
      .send({ idade: 99 });

    expect(res.statusCode).toBe(404);
    expect(getErrorMessage(res.body)).toMatch(/não encontrado/i);
  });

  it("não deve deletar usuário inexistente", async () => {
    const idFake = new mongoose.Types.ObjectId();

    const res = await request(app).delete(`/api/users/${idFake}`);

    expect(res.statusCode).toBe(404);
    expect(getErrorMessage(res.body)).toMatch(/não encontrado/i);
  });
});
