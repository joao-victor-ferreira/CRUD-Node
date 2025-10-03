// src/services/userService.js
import User from "../models/User.js";

// Criar usuário
export const createUser = async (data) => {
  const { name, email, idade } = data;

  if (!name || !email || idade === undefined) {
    const error = new Error("name, email e idade são obrigatórios");
    error.statusCode = 400;
    throw error;
  }

  try {
    const user = await User.create({ name, email, idade });
    return user;
  } catch (err) {
    if (err.code === 11000) {
      const error = new Error("Email já cadastrado");
      error.statusCode = 400;
      throw error;
    }
    throw err;
  }
};

// Listar todos
export const getUsers = async () => {
  return User.find().sort({ createdAt: -1 });
};

// Buscar por ID
export const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    const error = new Error("Usuário não encontrado");
    error.statusCode = 404;
    throw error;
  }
  return user;
};

// Atualizar
export const updateUser = async (id, updates) => {
  const user = await User.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
    overwrite: false,
  });

  if (!user) {
    const error = new Error("Usuário não encontrado");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

// Deletar
export const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    const error = new Error("Usuário não encontrado");
    error.statusCode = 404;
    throw error;
  }
  return { message: "Usuário deletado com sucesso" };
};
