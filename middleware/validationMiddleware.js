const Joi = require("joi");
const userValidatorSchema = Joi.object({
  name: Joi.object()
    .keys({
      first: Joi.string().min(2).max(50).required(),
      middle: Joi.string().min(2).max(50).allow(""),
      last: Joi.string().min(2).max(50).required(),
    })
    .required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .message(' "email" must be a valid email address')
    .required(),
  phone: Joi.string()
    .pattern(/^(0[2-4,8-9][0-9]{7}|0[57,73,74,76-79]{2}[0-9]{7})$/)
    .message('user "phone" must be a valid Israeli phone number')
    .required(),
  address: Joi.object({
    state: Joi.string().allow(""),
    country: Joi.string().required(),
    city: Joi.string().required(),
    street: Joi.string().required(),
    houseNumber: Joi.number().required(),
    zip: Joi.number(),
  }),
  image: Joi.object({
    url: Joi.string()
      .pattern(/(http(s?):)([/|.|\w|\s|-])*\./)
      .message('The "url" must be a valid image URL')
      .allow(""),
    alt: Joi.string().min(2).max(50).allow(""),
  }),
});
exports.newUserValidator = userValidatorSchema.append({
  password: Joi.string()
    .pattern(
      /((?=.*\d{1})(?=.*[A-Z]{1})(?=.*[a-z]{1})(?=.*[!@#$%^&*-]{1}).{7,20})/
    )
    .message(
      '"Password" must be 7-20 characters long and include at least one digit, one uppercase letter, one lowercase letter, and one special character (!@#$%^&*-).'
    )
    .required(),
});
exports.editUserValidator = userValidatorSchema;
exports.loginUserValidator = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .message('"email" must be a valid email address')
    .required(),
  password: Joi.string()
    .pattern(
      /((?=.*\d{1})(?=.*[A-Z]{1})(?=.*[a-z]{1})(?=.*[!@#$%^&*-]{1}).{7,20})/
    )
    .message(
      '"Password" must be 7-20 characters long and include at least one digit, one uppercase letter, one lowercase letter, and one special character (!@#$%^&*-).'
    )
    .required(),
});
exports.cardValidator = Joi.object({
  title: Joi.string().required().min(2).max(100),

  subtitle: Joi.string().required().min(2).max(100),

  description: Joi.string().required().min(10).max(500),

  phone: Joi.string()
    .pattern(/^(0[2-4,8-9][0-9]{7}|0[57,73,74,76-79]{2}[0-9]{7})$/)
    .message('user "phone" must be a valid Israeli phone number')
    .required(),

  web: Joi.string()
    .pattern(/(http(s?):)([/|.|\w|\s|-])*\./)
    .message('card "web" must be a valid url')
    .allow(""),

  image: Joi.object()
    .keys({
      url: Joi.string()
        .pattern(/(http(s?):)([/|.|\w|\s|-])*\./)
        .message('card.image "url" must be a valid url')
        .allow(""),
      alt: Joi.string().min(2).max(256).allow(""),
    })
    .required(),
  address: Joi.object()
    .keys({
      state: Joi.string().allow(""),
      country: Joi.string().min(2).max(256).required(),
      city: Joi.string().min(2).max(256).required(),
      street: Joi.string().min(2).max(256).required(),
      houseNumber: Joi.number().required(),
      zip: Joi.number(),
    })
    .required(),
});
