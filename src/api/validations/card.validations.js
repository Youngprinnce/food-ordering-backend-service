const Joi = require('joi');

const createCardSchema = Joi.object().keys({
  cardNumber: Joi.string().required(),
  cardExpiryDate: Joi.string().required(),
  CVV: Joi.string().required(),
});

module.exports = {
  createCardSchema,
};
