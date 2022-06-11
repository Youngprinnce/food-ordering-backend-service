/* eslint-disable no-return-await */
const {
  throwError,
} = require('../../utils');
const { Transaction } = require('../models');

module.exports = {
  Transaction() {
    return {
      async createTransaction(payload) {
        return await new Transaction(payload).save();
      },

      async getAllUserTransactions(userId) {
        return await Transaction.find({ userId }).orFail(() => throwError('User Transaction Not Found', 404));
      },

      async getTransactionByReference(reference) {
        return await Transaction.findOne({ reference }).orFail(() => throwError(`No Transaction Found With Reference ${reference}`));
      },
    };
  },
};
