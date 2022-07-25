const menuRoute = require('../../config/router-config');
const menuController = require('../controllers/menu.controllers');

menuRoute.post('/menus/favourite-meal', menuController.addFavouriteMeals);
menuRoute.get('/menus/favourite-meal', menuController.getFavouriteMeals);

module.exports = menuRoute;
