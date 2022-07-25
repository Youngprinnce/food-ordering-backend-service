const userDashboardRoute = require('../../config/router-config');
const userDashboardController = require('../controllers/user.dashboard.controllers');
const { authenticate } = require('../middlewares/auth');

userDashboardRoute.get('/user-dashboard/restaurant/featured', authenticate, userDashboardController.featuredRestaurants);
userDashboardRoute.get('/user-dashboard/restaurant/popular', authenticate, userDashboardController.popularRestaurants);
userDashboardRoute.get('/user-dashboard/restaurant/close-by', authenticate, userDashboardController.closeByRestaurants);
userDashboardRoute.get('/user-dashboard/restaurant/all', authenticate, userDashboardController.allRestaurants);
userDashboardRoute.get('/user-dashboard/searches/popular', authenticate, userDashboardController.popularSearches);
userDashboardRoute.get('/user-dashboard/search/:searchItem', authenticate, userDashboardController.search);
userDashboardRoute.post('/user-dashboard/search/category', authenticate, userDashboardController.searchByCategory);
userDashboardRoute.get('/user-dashboard/restaurant/:id/details', authenticate, userDashboardController.restaurantDetails);
userDashboardRoute.get('/user-dashboard/restaurant/:id/menus', authenticate, userDashboardController.restaurantMenus);
userDashboardRoute.get('/user-dashboard/restaurant/menus/:menuId', authenticate, userDashboardController.restaurantMenuDetails);

module.exports = userDashboardRoute;
