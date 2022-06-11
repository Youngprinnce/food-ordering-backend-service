const transactionRoute = require('../../config/router-config');
const transactionController = require('../controllers/transaction.controllers');
const { authenticate } = require('../middlewares/auth');

transactionRoute.get('/transactions', authenticate, transactionController.getAllUserTransactions);
transactionRoute.get('/transactions/reference/:reference', authenticate, transactionController.getTransactionByReference);

module.exports = transactionRoute;
