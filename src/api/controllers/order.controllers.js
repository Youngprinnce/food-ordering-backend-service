const {
  sendError, sendSuccess, throwError, generateToken,
} = require('../../utils');
const { Transaction, Wallet, Order } = require('../services');
const validations = require('../validations');
const { verifyPayment } = require('../../integrations/paystack');

const createOrder = async (req, res) => {
  try {
    await validations.order.createOrderSchema.validateAsync(req.body);
    const { userId } = req.auth;
    const { paymentMethod, amount } = req.body;
    const reference = Math.random().toString(36).substring(2, 12);
    if (paymentMethod === 'wallet') {
      const wallet = await Wallet().getUserWallet(userId);
      if (wallet.balance < amount) return throwError('Insufficient Balance', 400);
      const transactionDetails = {
        userId,
        amount,
        type: 'debit',
        paymentDate: new Date(),
        reference,
      };
      await Transaction().createTransaction(transactionDetails);
      await Wallet().debitWallet(amount, userId);
      const transaction = await Transaction().getTransactionByReference(reference);
      transaction.status = 'success';
      await transaction.save();
      const orderPayload = {
        ...req.body,
        reference,
        paymentStatus: 'success',
        paymentDate: new Date(),
        orderId: generateToken(8),
        userId,
      };
      const order = await Order().createOrder(orderPayload);
      return sendSuccess(res, { order }, 'Order Created Successfully', 201);
    }
    const orderPayload = {
      ...req.body,
      reference,
      orderId: generateToken(8),
      userId,
    };
    const order = await Order().createOrder(orderPayload);
    return sendSuccess(res, { order }, 'Order Created Successfully', 201);
  } catch (err) {
    if (err.isJoi === true) {
      return sendError(res, { ...err.details[0], statusCode: 422 });
    }
    return sendError(res, err);
  }
};

const verifyOrderPayment = async (req, res) => {
  try {
    const { reference } = req.params;
    const { status, paymentDate } = await verifyPayment(reference);
    const order = await Order().getOrderByReference(reference);
    if (status === 'success') {
      order.paymentStatus = 'success';
      order.paymentDate = paymentDate;
      await order.save();
      return sendSuccess(res, { order }, 'Order Payment Verified Successfully', 200);
    }
    order.paymentStatus = 'failed';
    await order.save();
    return sendError(res, { message: 'Payment Verification Failed', statusCode: 400 });
  } catch (err) {
    return sendError(res, err);
  }
};

const getAllUserOrders = async (req, res) => {
  try {
    const { userId } = req.auth;
    const orders = await Order().getAllUserOrders(userId);
    return sendSuccess(res, { orders }, 'All User Orders', 200);
  } catch (err) {
    return sendError(res, err);
  }
};

const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order().getOrderById(orderId);
    return sendSuccess(res, { order }, 'Order Details', 200);
  } catch (err) {
    return sendError(res, err);
  }
};

module.exports = {
  createOrder,
  verifyOrderPayment,
  getAllUserOrders,
  getOrderById,
};
