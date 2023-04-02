const Joi = require("joi");

const validateJoi = (requesBody) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(10),
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: true },
    }),
    phone: Joi.string().min(6).max(12),
  });
  const validateResul = schema.validate(requesBody);
  return validateResul;
};

module.exports = validateJoi;
