// src/routes/userRoutes.js
import express from "express";
import * as userController from "../controllers/userController.js";
import validate from "../middlewares/validate.js";
import { userSchema } from "../validations/userValidation.js";

const router = express.Router();

// Rotas
router.post("/", validate(userSchema), userController.createUser);
router.get("/", userController.getUsers);
router.get("/:id", userController.getUserById);

// aqui não usamos validate(userSchema), pq update pode ser parcial
router.put("/:id", userController.updateUser);

router.delete("/:id", userController.deleteUser);

export default router;
