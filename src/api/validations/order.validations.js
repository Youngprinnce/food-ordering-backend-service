const Joi = require('joi');

const createOrderSchema = Joi.object().keys({
  amount: Joi.number().required(),
  orderItems: Joi.array().items(Joi.object().keys({
    mealId: Joi.string().required(),
    quantity: Joi.number().required(),
    addons: Joi.array().items(Joi.string()),
    allergyNote: Joi.string(),
  })),
  vendorId: Joi.string().required().length(24),
  cutlery: Joi.boolean(),
  note: Joi.string(),
  paymentMethod: Joi.string().required().valid('card', 'wallet'),
  shippingAddress: Joi.string().required().length(24),
});

module.exports = {
  createOrderSchema,
};
