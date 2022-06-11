const Joi = require('joi');

const createAddressSchema = Joi.object().keys({
  addressNickname: Joi.string(),
  apartmentNumber: Joi.number(),
  street: Joi.string(),
  localGov: Joi.string(),
  building: Joi.string(),
  floor: Joi.number(),
  extraInfo: Joi.string(),
  geoLocation: Joi.object().keys({
    type: Joi.string().default('Point'),
    coordinates: Joi.array().items(Joi.number()).required(),
  }),
});

module.exports = {
  createAddressSchema,
};
