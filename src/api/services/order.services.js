/* eslint-disable no-return-await */
const {
  throwError,
} = require('../../utils');
const { Order } = require('../models');

module.exports = {
  Order() {
    return {
      async createOrder(payload) {
        return await new Order(payload).save();
      },

      async getAllUserOrders(userId) {
        return await Order.find({ userId }).sort({ $natural: -1 }).select({
          orderId: 1,
          paymentDate: 1,
          status: 1,
          _id: 1,
        }).populate('vendorId', 'vendorName vendorLogo vendorBannerImage');
      },

      async getOrderById(orderId) {
        return await Order.findOne({ _id: orderId }).populate('vendorId shippingAddress', 'vendorName').orFail(() => throwError('Order Not Found', 404));
      },

      async getOrderByReference(reference) {
        return await Order.findOne({ reference }).orFail(() => throwError(`No Order Found With Reference ${reference}`));
      },
    };
  },
};
