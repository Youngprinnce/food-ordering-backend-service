const {
  sendError, sendSuccess, throwError,
} = require('../../utils');
const { Menu } = require('../services/menu.services');

// Create many fav meals ===> /api/menus/favourite-meal
const addFavouriteMeals = async (req, res) => {
  try {
    const { favMeals } = req.body;

    const response = await Menu().addFavouriteMeals(favMeals);

    if (response.error) throwError(response.error, 401);

    return sendSuccess(res, response, 'Favourite meals created successfully', 201);
  } catch (err) {
    return sendError(res, err);
  }
};

// Get all fav meals  ===> /api/menus/favourite-meal
const getFavouriteMeals = async (req, res) => {
  try {
    const response = await Menu().getFavouriteMeals();

    if (response.error) throwError(response.error, 401);

    return sendSuccess(res, response, 'Favourite Meals fetched successfully', 200);
  } catch (err) {
    return sendError(res, err);
  }
};

module.exports = {
  addFavouriteMeals,
  getFavouriteMeals,
};
