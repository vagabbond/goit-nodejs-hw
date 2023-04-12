const Joi = require("joi");

module.exports = {
  validateAddData: (req, res, next) => {
    const addSchema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
    });
    const { error } = addSchema.validate(req.body);
    if (!req.body.name) {
      return res.status(400).json({
        message: "missing required name field",
      });
    } else if (!req.body.email) {
      return res.status(400).json({
        message: "missing required email field",
      });
    } else if (!req.body.phone) {
      return res.status(400).json({
        message: "missing required phone field",
      });
    } else if (error) {
      return res.status(400).json({
        message: "missing fields",
      });
    }
    next();
  },
  validatePutData: (req, res, next) => {
    const addSchema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
    });
    const { error } = addSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: "missing fields",
      });
    }
    next();
  },

  validateFavoriteSchema: (req, res, next) => {
    const schema = Joi.object({
      favorite: Joi.boolean().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: "missing field favorite",
      });
    }
    next();
  },
};
