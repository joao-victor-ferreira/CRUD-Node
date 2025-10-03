// testes/user.test.js
import dotenv from "dotenv";
import request from "supertest";
import mongoose from "mongoose";
import app from "../src/server.js";
import User from "../src/models/User.js";

// Importa Jest globals (necessário em ESM)
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

// Conectar ao banco de teste
beforeAll(async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error(
      "❌ MONGO_URI não carregado. Verifique seu arquivo .env.test"
    );
  }

  // Troca o nome do DB para uma base separada de testes
  const mongoTestUri = uri.replace("Teste", "TesteJest");
  await mongoose.connect(mongoTestUri);
});

// Limpar dados antes de cada teste
beforeEach(async () => {
  await User.deleteMany();
});

// Fechar conexão após testes
afterAll(async () => {
  await mongoose.connection.dropDatabase(); // limpa a base de testes
  await mongoose.connection.close();
});

describe("API /api/users", () => {
  // --- Fluxos felizes (happy path) ---
  it("deve criar um novo usuário", async () => {
    const res = await request(app)
      .post("/api/users")
      .send({
        name: "Teste",
        email: `teste${Date.now()}@email.com`, // sempre único
        idade: 30,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.name).toBe("Teste");
  });

  it("deve listar usuários", async () => {
    await User.create({ name: "Maria", email: "maria@email.com", idade: 25 });

    const res = await request(app).get("/api/users");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe("Maria");
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

  

  it("não deve criar usuário duplicado", async () => {
    const email = `duplicado${Date.now()}@email.com`;

    await User.create({ name: "Primeiro", email, idade: 30 });

    const res = await request(app).post("/api/users").send({
      name: "Segundo",
      email,
      idade: 25,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error || res.body.message).toMatch(/já cadastrado|duplicado/i);
  });

  it("não deve buscar usuário com ID inválido", async () => {
    const res = await request(app).get("/api/users/123"); // ID inválido

    expect(res.statusCode).toBe(400);
    expect(res.body.error || res.body.message).toMatch(/inválido/i);
  });

  it("não deve atualizar usuário inexistente", async () => {
    const idFake = new mongoose.Types.ObjectId();

    const res = await request(app)
      .put(`/api/users/${idFake}`)
      .send({ idade: 99 });

    expect(res.statusCode).toBe(404);
    expect(res.body.error || res.body.message).toMatch(/não encontrado/i);
  });

  it("não deve deletar usuário inexistente", async () => {
    const idFake = new mongoose.Types.ObjectId();

    const res = await request(app).delete(`/api/users/${idFake}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.error || res.body.message).toMatch(/não encontrado/i);
  });
});
