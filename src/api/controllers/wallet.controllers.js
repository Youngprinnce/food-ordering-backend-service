const {
  sendError, sendSuccess,
} = require('../../utils');
const { Wallet, Transaction } = require('../services');
const validations = require('../validations');
const { verifyPayment } = require('../../integrations/paystack');

// fund wallet
const fundWallet = async (req, res) => {
  try {
    await validations.wallet.fundWallet.validateAsync(req.body);
    const { userId } = req.auth;
    const { amount } = req.body;
    const reference = Math.random().toString(36).substring(2, 12);
    const transactionDetails = {
      userId,
      amount,
      reason: 'Fund Wallet',
      type: 'credit',
      reference,
      paymentDate: Date.now(),
      status: 'pending',
    };
    await Transaction().createTransaction(transactionDetails);
    return sendSuccess(res, { reference }, '', 200);
  } catch (err) {
    return sendError(res, err);
  }
};

// verify fund transfer
const verifyFundTransfer = async (req, res) => {
  try {
    const { reference } = req.params;
    // const { status } = await verifyPayment(reference);
    const transactionDetails = await Transaction().getTransactionByReference(reference);
    if ('success' === 'success') {
      await Wallet().creditWallet(transactionDetails.amount, transactionDetails.userId);
      transactionDetails.status = 'success';
      await transactionDetails.save();
    }
    return sendSuccess(res, transactionDetails, '', 200);
  } catch (err) {
    return sendError(res, err);
  }
};

const getUserWallet = async (req, res) => {
  try {
    const { userId } = req.auth;
    const wallet = await Wallet().getUserWallet(userId);
    return sendSuccess(res, { wallet }, '', 200);
  } catch (err) {
    return sendError(res, err);
  }
};

module.exports = {
  fundWallet,
  verifyFundTransfer,
  getUserWallet,
};
