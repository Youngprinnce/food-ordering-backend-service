const joi = require('joi');

const fundWallet = joi.object().keys({
  amount: joi.number().required().min(1).max(1000000),
});

module.exports = {
  fundWallet,
};
