const validateBody = (schema) => {
  const func = async (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: " Bad request",
      });
    }
    next();
  };

  return func;
};

module.exports = validateBody;
