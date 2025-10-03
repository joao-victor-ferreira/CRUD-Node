const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    // passa o erro para o errorHandler
    error.name = "ValidationError"; 
    error.details = error.details; 
    return next(error);
  }
  next();
};

export default validate;
