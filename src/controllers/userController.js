// src/controllers/userController.js
import userService from "../services/userService.js";
import { HTTP_STATUS, MESSAGES } from "../constants/index.js";

// Criar usuário
export const createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    return res.status(HTTP_STATUS.CREATED).json(user); // já vem como DTO
  } catch (err) {
    return next(err);
  }
};

// Listar todos
export const getUsers = async (req, res, next) => {
  try {
    const users = await userService.getUsers();
    return res.status(HTTP_STATUS.OK).json(users); // lista de DTOs
  } catch (err) {
    return next(err);
  }
};

// Buscar por ID
export const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: MESSAGES.USER.NOT_FOUND });
    }
    return res.status(HTTP_STATUS.OK).json(user);
  } catch (err) {
    return next(err);
  }
};

// Atualizar
export const updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    if (!user) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: MESSAGES.USER.NOT_FOUND });
    }
    return res.status(HTTP_STATUS.OK).json(user);
  } catch (err) {
    return next(err);
  }
};

// Deletar
export const deleteUser = async (req, res, next) => {
  try {
    const result = await userService.deleteUser(req.params.id);
    if (!result) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: MESSAGES.USER.NOT_FOUND });
    }
    return res
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: MESSAGES.USER.DELETED });
  } catch (err) {
    return next(err);
  }
};
