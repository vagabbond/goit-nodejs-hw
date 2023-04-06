const errorMessages = {
  400: "missing fields",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  409: "Conflict",
};
const ErrorHandler = (status, message = errorMessages[status]) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const validateError = (req, addSchema, status, string) => {
  const { error } = addSchema.validate(req.body);
  if (error) {
    throw ErrorHandler(status, string);
  }
};

module.exports = {
  validateError,
};
