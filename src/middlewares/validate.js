const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    // passa o erro para o errorHandler
    error.name = "ValidationError";
    return next(error); // remove a linha problemática
  }
  next();
};

export default validate;
