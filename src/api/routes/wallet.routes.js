const walletRoute = require('../../config/router-config');
const walletController = require('../controllers/wallet.controllers');
const { authenticate } = require('../middlewares/auth');

walletRoute.get('/wallets', authenticate, walletController.getUserWallet);
walletRoute.put('/wallets/fund', authenticate, walletController.fundWallet);
// walletRoute.put('/wallets/withdrawal', authenticate, walletController.withdrawFund);
walletRoute.get('/wallets/verify-fund/:reference', authenticate, walletController.verifyFundTransfer);

module.exports = walletRoute;
