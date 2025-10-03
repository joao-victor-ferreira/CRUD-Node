// src/middlewares/errorHandler.js
export default function errorHandler(err, req, res, next) {
  console.error("🔥 Erro capturado:", err);

  let status = err.statusCode || 500;

  const errorResponse = {
    success: false,
    status,
    message: err.message || "Erro interno do servidor",
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
  };

  // 📌 Erros de validação (Joi/Mongoose)
  if (err.name === "ValidationError") {
    status = 400;
    errorResponse.status = 400;

    // Se tiver detalhes de validação (ex: Joi), junta as mensagens
    if (err.details) {
      errorResponse.message = err.details.map((d) => d.message).join(", ");
    } else {
      errorResponse.message = err.message || "Erro de validação";
    }

    return res.status(400).json(errorResponse);
  }

  // 📌 Erros de chave duplicada no MongoDB
  if (err.code === 11000) {
    status = 400;
    errorResponse.status = 400;
    errorResponse.message = `Valor duplicado para o campo: ${Object.keys(err.keyValue).join(", ")}`;
    return res.status(400).json(errorResponse);
  }

  // 📌 CastError (ObjectId inválido)
  if (err.name === "CastError") {
    status = 400;
    errorResponse.status = 400;
    errorResponse.message = `ID inválido: ${err.value}`;
    return res.status(400).json(errorResponse);
  }

  return res.status(status).json(errorResponse);
}
