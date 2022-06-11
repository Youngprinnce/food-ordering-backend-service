const logger = require('../../utils/logger');
const { Card } = require('../models');

module.exports = {
  Card() {
    return {
      async createCard(userId, payload) {
        try {
          const card = await Card.findOne({ userId });
          if (card) {
            if (card.cardDetails.length > 0) {
              const { cardDetails } = card;
              cardDetails.push(payload);
              const updatedCard = await Card.findOneAndUpdate({ userId }, { cardDetails }, { new: true });
              return updatedCard.cardDetails;
            }
            const { cardDetails } = card;
            payload.defaultCard = true;
            cardDetails.push(payload);
            const updatedCard = await Card.findOneAndUpdate({ userId }, { cardDetails }, { new: true });
            return updatedCard.cardDetails;
          }
          payload.defaultCard = true;
          const newCard = await Card.create({ userId, cardDetails: [payload] });
          return newCard.cardDetails;
        } catch (error) {
          logger.error(error);
          throw error;
        }
      },

      async getCards(userId) {
        try {
          const cards = await Card.findOne({ userId });
          return cards.cardDetails;
        } catch (error) {
          logger.error(error);
          throw error;
        }
      },

      async getCard(userId, cardId) {
        try {
          const cards = await Card.findOne({ userId });
          const card = cards.cardDetails.find((card) => card._id.toString() === cardId);
          return card;
        } catch (error) {
          logger.error(error);
          throw error;
        }
      },

      async deleteCard(userId, cardId) {
        try {
          const cards = await Card.findOne({ userId });
          const cardDetails = cards.cardDetails.filter((card) => card._id.toString() !== cardId);
          if (cardDetails.length === 1) {
            cardDetails[0].defaultCard = true;
          }
          const updatedCards = await Card.findOneAndUpdate({ userId }, { cardDetails }, { new: true });
          return updatedCards.cardDetails;
        } catch (error) {
          logger.error(error);
          throw error;
        }
      },

      async updateCard(userId, cardId) {
        try {
          // update card by setting defaultCard to true
          const cards = await Card.findOne({ userId });

          const cardDetails = cards.cardDetails.map((card) => {
            if (card._id.toString() === cardId) {
              card.defaultCard = true;
            } else {
              card.defaultCard = false;
            }
            return card;
          });

          const updatedCards = await Card.findOneAndUpdate({ userId }, { cardDetails }, { new: true });
          return updatedCards.cardDetails;
        } catch (error) {
          logger.error(error);
          throw error;
        }
      },
    };
  },
};
