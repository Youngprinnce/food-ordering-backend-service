const Joi = require('joi');

const addItemToCartSchema = Joi.object().keys({
  mealId: Joi.string().length(24).required(),
  quantity: Joi.number().required().min(1),
  price: Joi.number().required(),
  addons: Joi.array().items(Joi.string().required()),
  allergyNote: Joi.string(),
  cutlery: Joi.boolean().default(false),
  note: Joi.string(),
});

const changeCartItemQuantity = Joi.object().keys({
  itemId: Joi.string().length(24).required(),
  status: Joi.string().valid('increase', 'decrease').required(),
});

const updateCart = Joi.object().keys({
  cutlery: Joi.boolean().default(false),
  note: Joi.string().default(''),
});

module.exports = {
  addItemToCartSchema,
  changeCartItemQuantity,
  updateCart,
};
