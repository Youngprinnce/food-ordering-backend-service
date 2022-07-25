const {
  throwError,
} = require('../../utils');
const { Address } = require('../models');

module.exports = {
  Address() {
    return {
      async createAddress(payload) {
        const { userId, addressNickname } = payload;
        const address = await Address.find({ userId });
        if (address.length === 0) {
          payload.defaultAddress = true;
          payload.addressNickname = addressNickname || 'Primary Address';
        }
        return await new Address(payload).save();
      },

      async getAllAddress(userId) {
        return await Address.find({ userId }).orFail(() => throwError('User Address Not Found', 404));
      },

      async getAddressById(id) {
        return await Address.findById(id).orFail(() => throwError(`No Address Found With Id ${id}`));
      },

      async deleteAddress(id) {
        return await Address.findByIdAndDelete(id).orFail(() => throwError(`No Address Found With Id ${id}`));
      },

      async updateAddress(id, userId) {
        const addresses = await Address.find({ userId });
        addresses.forEach((address) => {
          if (address.id === id) {
            address.defaultAddress = true;
          } else {
            address.defaultAddress = false;
          }
          address.save();
        });
        return await Address.findByIdAndUpdate(id, { defaultAddress: true }).orFail(() => throwError(`No Address Found With Id ${id}`));
      },
    };
  },
};
