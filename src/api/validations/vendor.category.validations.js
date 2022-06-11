const Joi = require('joi');

const createCategorySchema = Joi.object().keys({
  category: Joi.string().required(),
});

module.exports = {
  createCategorySchema,
};
