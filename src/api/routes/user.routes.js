const userRoute = require('../../config/router-config');
const userController = require('../controllers/user.controllers');
const { authenticate } = require('../middlewares/auth');

userRoute.post('/users/signup', userController.signup);
userRoute.post('/users/verify-account', userController.verifyAccount);
userRoute.get('/users/resend-token', authenticate, userController.resendToken);
userRoute.post('/users/login', userController.login);
userRoute.put('/users/update-profile', authenticate, userController.updateProfile);
userRoute.get('/users/:userId', userController.getUser);
userRoute.put('/users/forgot-password', userController.forgotPassword);
userRoute.post('/users/reset-password', userController.resetPassword);
userRoute.get('/users/google/url', userController.getGoogleUrl); // generates url for both login and register
userRoute.get('/auth/google/callback', userController.googleDetails); // handles both login and register

module.exports = userRoute;
