const {
  sendError, sendSuccess,
} = require('../../utils');
const { Transaction } = require('../services');

const getAllUserTransactions = async (req, res) => {
  try {
    const { userId } = req.auth;
    const transactions = await Transaction().getAllUserTransactions(userId);
    if (!transactions) {
      return sendSuccess(res, { transactions: [] });
    }
    return sendSuccess(res, { transactions });
  } catch (err) {
    return sendError(res, err);
  }
};

const getTransactionByReference = async (req, res) => {
  try {
    const transaction = await Transaction().getTransactionByReference(req.params.reference);
    return sendSuccess(res, { transaction });
  } catch (err) {
    return sendError(res, err);
  }
};

module.exports = {
  getTransactionByReference,
  getAllUserTransactions,
};
