const orderRoute = require('../../config/router-config');
const orderController = require('../controllers/order.controllers');
const { authenticate } = require('../middlewares/auth');

orderRoute.post('/orders', authenticate, orderController.createOrder);
orderRoute.get('/orders/verify-payment/:reference', authenticate, orderController.verifyOrderPayment);
orderRoute.get('/orders', authenticate, orderController.getAllUserOrders);
orderRoute.get('/orders/:orderId', authenticate, orderController.getOrderById);

module.exports = orderRoute;
