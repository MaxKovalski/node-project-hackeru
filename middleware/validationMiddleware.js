const Joi = require("joi");
const userValidatorSchema = Joi.object({
  name: Joi.object({
    first: Joi.string().required(),
    middle: Joi.string().optional(),
    last: Joi.string().required(),
  }),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
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
exports.newUserValidator = userValidatorSchema.append({
  password: Joi.string().required(),
});
exports.editUserValidator = userValidatorSchema;
exports.loginUserValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
