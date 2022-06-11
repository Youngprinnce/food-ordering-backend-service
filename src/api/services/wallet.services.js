const { logger, throwError } = require('../../utils');
const { Wallet } = require('../models');

module.exports = {
  Wallet() {
    return {
      async createWallet(userId) {
        try {
          const newWallet = await Wallet.create({ userId });
          return { wallet: newWallet };
        } catch (ex) {
          logger.log({
            level: 'error',
            message: ex.message,
          });
          return { error: ex };
        }
      },

      async getUserWallet(userId) {
        return await Wallet.findOne({ userId }).orFail(() => throwError('Wallet Not Found', 404));
      },

      async creditWallet(amount, userId) {
        const userWallet = await Wallet.findOne({ userId });
        userWallet.balance += Number(amount);
        return await userWallet.save();
      },

      async debitWallet(amount, userId) {
        const userWallet = await Wallet.findOne({ userId });
        userWallet.balance -= Number(amount);
        return await userWallet.save();
      },
    };
  },
};
