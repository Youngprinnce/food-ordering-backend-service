const Joi = require('joi');

const updateProfileSchema = Joi.object().keys({
  firstname: Joi.string().max(50).min(2),
  lastname: Joi.string().max(50).min(2),
  email: Joi.string().email(),
  favouriteMeals: Joi.array().items(Joi.string().length(24)),
  offers: Joi.boolean().default(false),
  gender: Joi.string().valid('male', 'female'),
  address: Joi.string(),
  geoLocation: Joi.object().keys({
    type: Joi.string().valid('Point'),
    coordinates: Joi.array().items(Joi.number()),
  }),
});

module.exports = {
  updateProfileSchema,
};
