const cartRoute = require('../../config/router-config');
const cartController = require('../controllers/cart.controllers');
const { authenticate } = require('../middlewares/auth');

cartRoute.post('/carts', authenticate, cartController.addItemToCart);
cartRoute.get('/carts', authenticate, cartController.getCartItems);
cartRoute.put('/carts/change-quantity/:itemId/:status', authenticate, cartController.changeCartItemQuantity);
cartRoute.put('/carts', authenticate, cartController.updateCart);
cartRoute.delete('/carts/:itemId', authenticate, cartController.deleteCartItem);

module.exports = cartRoute;
