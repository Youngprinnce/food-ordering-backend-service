const logger = require('../../utils/logger');
const { FavouriteMeal } = require('../models');

module.exports = {
  Menu() {
    return {
      async addFavouriteMeals(favMeals) {
        try {
          const newFavMeals = await FavouriteMeal.insertMany(favMeals);
          return newFavMeals;
        } catch (ex) {
          logger.log({
            level: 'error',
            message: ex.message,
          });
          return { error: ex };
        }
      },

      async getFavouriteMeals() {
        try {
          return await FavouriteMeal.find({});
        } catch (ex) {
          logger.log({
            level: 'error',
            message: ex.message,
          });
          return { error: ex };
        }
      },
    };
  },
};
