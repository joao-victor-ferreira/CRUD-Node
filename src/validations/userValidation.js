import Joi from "joi";

export const userSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.base": "O nome deve ser um texto",
    "string.empty": "O nome não pode estar vazio",
    "string.min": "O nome deve ter pelo menos {#limit} caracteres",
    "string.max": "O nome deve ter no máximo {#limit} caracteres",
    "any.required": "O nome é obrigatório",
  }),
  email: Joi.string().email().required().messages({
    "string.base": "O e-mail deve ser um texto",
    "string.empty": "O e-mail não pode estar vazio",
    "string.email": "O e-mail deve ser válido",
    "any.required": "O e-mail é obrigatório",
  }),
  idade: Joi.number().integer().min(0).max(120).required().messages({
    "number.base": "A idade deve ser um número",
    "number.integer": "A idade deve ser um número inteiro",
    "number.min": "A idade não pode ser negativa",
    "number.max": "A idade não pode ser maior que {#limit}",
    "any.required": "A idade é obrigatória",
  }),
});
