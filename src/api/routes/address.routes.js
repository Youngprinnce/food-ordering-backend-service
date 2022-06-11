const addressRoute = require('../../config/router-config');
const addressController = require('../controllers/address.controllers');
const { authenticate } = require('../middlewares/auth');

addressRoute.post('/address', authenticate, addressController.createAddress);
addressRoute.get('/address', authenticate, addressController.getAllAddress);
addressRoute.get('/address/:id', authenticate, addressController.getAddressById);
addressRoute.delete('/address/:id', authenticate, addressController.deleteAddress);
addressRoute.put('/address/:id', authenticate, addressController.updateAddress);

module.exports = addressRoute;
