// import all validations
const user = require('./user.validations');
const category = require('./vendor.category.validations');
const vendor = require('./vendor.validations');
const common = require('./common.validations');
const cart = require('./cart.validations');
const card = require('./card.validations');
const wallet = require('./wallet.validations');
const order = require('./order.validations');
const address = require('./address.validations');

module.exports = {
  user,
  category,
  vendor,
  common,
  cart,
  card,
  wallet,
  order,
  address,
};
