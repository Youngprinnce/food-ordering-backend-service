const { sendError, sendSuccess } = require('../../utils');
const { Card } = require('../services/card.services');
const validations = require('../validations');

const createCard = async (req, res) => {
  try {
    await validations.card.createCardSchema.validateAsync(req.body);
    const { userId } = req.auth;
    const response = await Card().createCard(userId, req.body);
    sendSuccess(res, { cardDetails: response }, 'Card details successfuly saved', 201);
  } catch (err) {
    if (err.isJoi === true) {
      return sendError(res, { ...err.details[0], statusCode: 422 });
    }
    return sendError(res, err);
  }
};

const getCards = async (req, res) => {
  try {
    const { userId } = req.auth;
    const response = await Card().getCards(userId);
    sendSuccess(res, { cardDetails: response }, 'Card details fetched successfuly', 200);
  } catch (err) {
    return sendError(res, err);
  }
};

const getCard = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { cardId } = req.params;
    const response = await Card().getCard(userId, cardId);
    sendSuccess(res, { cardDetails: response }, 'Card details fetched successfuly', 200);
  } catch (err) {
    return sendError(res, err);
  }
};

const deleteCard = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { cardId } = req.params;
    const response = await Card().deleteCard(userId, cardId);
    sendSuccess(res, { cardDetails: response }, 'Card deleted successfully', 200);
  } catch (err) {
    return sendError(res, err);
  }
};

const updateCard = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { cardId } = req.params;
    const response = await Card().updateCard(userId, cardId, req.body);
    sendSuccess(res, { cardDetails: response }, 'Card updated successfully', 200);
  } catch (err) {
    return sendError(res, err);
  }
};

module.exports = {
  createCard,
  getCards,
  getCard,
  deleteCard,
  updateCard,
};
