const cardRoute = require('../../config/router-config');
const cardController = require('../controllers/card.controllers');
const { authenticate } = require('../middlewares/auth');

cardRoute.post('/cards', authenticate, cardController.createCard);
cardRoute.get('/cards', authenticate, cardController.getCards);
cardRoute.get('/cards/:cardId', authenticate, cardController.getCard);
cardRoute.delete('/cards/:cardId', authenticate, cardController.deleteCard);
cardRoute.put('/cards/:cardId', authenticate, cardController.updateCard);

module.exports = cardRoute;
