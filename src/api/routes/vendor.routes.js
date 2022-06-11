const vendorRoute = require('../../config/router-config');
const vendorController = require('../controllers/vendor.controllers');
const { authenticate } = require('../middlewares/auth');
const { upload } = require('../../utils/upload-file');

vendorRoute.post('/vendors/signup/step-one', vendorController.signupStepOne);
vendorRoute.post('/vendors/verify-account', vendorController.verifyAccount);
vendorRoute.get('/vendors/resend-token', authenticate, vendorController.resendToken);
vendorRoute.put('/vendors/signup/step-two', authenticate, upload.fields([
  { name: 'vendorLogo', maxCount: 1 },
  { name: 'vendorBannerImage', maxCount: 1 },
  { name: 'identificationImage', maxCount: 1 },
  { name: 'vendorCertificateImage', maxCount: 1 },
  { name: 'vendorMenu', maxCount: 1 },
]), vendorController.signupStepTwo);
vendorRoute.post('/vendors/login', vendorController.login);
vendorRoute.put('/vendors/forgot-password', vendorController.forgotPassword);
vendorRoute.post('/vendors/reset-password', vendorController.resetPassword);
vendorRoute.get('/vendors/:vendorId', authenticate, vendorController.getVendor);
vendorRoute.put('/vendors/:vendorId', authenticate, vendorController.updateVendor);
vendorRoute.post('/vendors/menu/add', authenticate, upload.single('image'), vendorController.addMenu);
vendorRoute.get('/vendors/menu/all', authenticate, vendorController.getAllMenu);
vendorRoute.get('/vendors/menu/:menuId', authenticate, vendorController.getMenu);
vendorRoute.put('/vendors/menu/:menuId', authenticate, vendorController.updateMenu);
vendorRoute.delete('/vendors/menu/:menuId', authenticate, vendorController.deleteMenu);
vendorRoute.post('/vendors/combo/add', authenticate, vendorController.addCombo);
vendorRoute.get('/vendors/combo/all', authenticate, vendorController.getAllCombo);
vendorRoute.delete('/vendors/combo/:comboId', authenticate, vendorController.deleteCombo);
vendorRoute.put('/vendors/change/password', authenticate, vendorController.changePassword);
vendorRoute.put('/vendors/change/email', authenticate, vendorController.changeEmail);
vendorRoute.put('/vendors/update/opening-hours', authenticate, vendorController.updateOpeningHours);

module.exports = vendorRoute;
