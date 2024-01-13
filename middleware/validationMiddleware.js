const Joi = require("joi");
exports.validationMiddleware = Joi.object({
  name: Joi.object({
    first: Joi.string().required(),
    middle: Joi.string().optional(),
    last: Joi.string().required(),
  }),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  password: Joi.string().required(),
  address: Joi.object({
    state: Joi.string(),
    country: Joi.string(),
    city: Joi.string(),
    street: Joi.string(),
    houseNumber: Joi.number(),
  }),
  image: Joi.object({
    url: Joi.string(),
    alt: Joi.string(),
  }),
});
