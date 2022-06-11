const Joi = require('joi');

const loginSchema = Joi.object().keys({
  emailorMobile: Joi.string().required(),
  password: Joi.string().required(),
});

const strongPasswordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
const stringPassswordError = new Error('Password must be strong. At least one upper case alphabet. At least one lower case alphabet. At least one digit. At least one special character. Minimum eight in length');

const registerSchema = Joi.object().keys({
  email: Joi.string().email().required().trim(),
  password: Joi.string().regex(strongPasswordRegex).error(stringPassswordError).required(),
  firstname: Joi.string().required().max(50).min(2),
  lastname: Joi.string().required().max(50).min(2),
  mobile: Joi.string().required(),
  offers: Joi.boolean().default(false),
  referralId: Joi.string(),
});

const mongoObjectId = Joi.string().length(24);

const verifyTokenSchema = Joi.object().keys({
  mobileToken: Joi.string().allow(''),
  emailToken: Joi.string().required().length(4),
});

const resetPasswordSchema = Joi.object().keys({
  token: Joi.string().required().length(4),
  password: Joi.string().regex(strongPasswordRegex).error(stringPassswordError).required(),
});

const forgotPasswordSchema = Joi.object().keys({
  emailorMobile: Joi.string().required(),
});

module.exports = {
  loginSchema,
  registerSchema,
  mongoObjectId,
  verifyTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};
