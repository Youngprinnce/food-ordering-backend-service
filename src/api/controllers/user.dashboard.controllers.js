const {
  sendError, sendSuccess, throwError,
} = require('../../utils');
const { UserDashboard, Vendor } = require('../services');
// const validations = require('../validations');

// get featured restaturant for user dashboard ===> /api/user-dashboard/restaurant/featured
const featuredRestaurants = async (req, res) => {
  try {
    const response = await UserDashboard().featuredRestaurants(req.auth.userId);

    if (response.error) throwError(response.error, 401);

    return sendSuccess(res, response, 'Featured restaturant fetched successfully', 200);
  } catch (err) {
    return sendError(res, err);
  }
};

// get popular restaturant for user dashboard ===> /api/user-dashboard/restaurant/popular
const popularRestaurants = async (req, res) => {
  try {
    const response = await UserDashboard().popularRestaurants(req.auth.userId);

    if (response.error) throwError(response.error, 401);

    return sendSuccess(res, response, 'Popular restaturant fetched successfully', 200);
  } catch (err) {
    return sendError(res, err);
  }
};

// get close By restaturant for user dashboard ===> /api/user-dashboard/restaurant/close-by
const closeByRestaurants = async (req, res) => {
  try {
    const response = await UserDashboard().closeByRestaurants(req.auth.userId);

    if (response.error) throwError(response.error, 401);

    return sendSuccess(res, response, 'Close By restaturant fetched successfully', 200);
  } catch (err) {
    return sendError(res, err);
  }
};

// get close By restaturant for user dashboard ===> /api/user-dashboard/restaurant/close-by
const allRestaurants = async (req, res) => {
  try {
    const response = await UserDashboard().allRestaurants(req.auth.userId);

    if (response.error) throwError(response.error, 401);

    return sendSuccess(res, response, 'All restaturant fetched successfully', 200);
  } catch (err) {
    return sendError(res, err);
  }
};

// Popular searches made by users on dashboard ===> /api/user-dashboard/searches/popular
const popularSearches = async (req, res) => {
  try {
    const response = await UserDashboard().popularSearches(req.auth.userId);

    if (response.error) throwError(response.error, 401);

    return sendSuccess(res, response, 'Fetched top searches successfully', 200);
  } catch (err) {
    return sendError(res, err);
  }
};

// Search for food item ===> /api/user-dashboard/search/:searchItem
const search = async (req, res) => {
  try {
    const { searchItem } = req.params;
    if (!searchItem || searchItem === '') throwError('Search cannot be empty', 422);
    const response = await UserDashboard().search(searchItem, req.auth.userId);

    if (response.error) throwError(response.error, 401);

    return sendSuccess(res, response, 'Search results Fetched successfully', 200);
  } catch (err) {
    return sendError(res, err);
  }
};

// Search by category ===> /api/user-dashboard/search/category
const searchByCategory = async (req, res) => {
  try {
    const { categories } = req.body;
    if (!categories || categories.length === 0) throwError('Categories cannot be empty', 422);
    const response = await UserDashboard().searchByCategory(categories, req.auth.userId);

    if (response.error) throwError(response.error, 401);

    return sendSuccess(res, response, 'Category search fetched successfully', 200);
  } catch (err) {
    return sendError(res, err);
  }
};

// Get restaurant details and menu ===> /api/user-dashboard/restaurant/:id/details
const restaurantDetails = async (req, res) => {
  try {
    const { id } = req.params;

    await Vendor().getVendor(id);

    const obj = {
      vendorId: id,
      userId: req.auth.userId,
    };

    const response = await UserDashboard().restaurantDetails(obj);

    if (response.error) throwError(response.error, 401);

    return sendSuccess(res, response, 'Restaurants details fetched successfully', 200);
  } catch (err) {
    return sendError(res, err);
  }
};

// Get restaurant menus ===> /api/user-dashboard/restaurant/:id/menus
const restaurantMenus = async (req, res) => {
  try {
    const { id } = req.params;

    await Vendor().getVendor(id);

    const response = await UserDashboard().restaurantMenus(id);

    if (response.error) throwError(response.error, 401);

    return sendSuccess(res, response, 'Restaurants menus fetched successfully', 200);
  } catch (err) {
    return sendError(res, err);
  }
};

// Get restaurant menus ===> /api/user-dashboard/restaurant/:id/menus/:menuId
const restaurantMenuDetails = async (req, res) => {
  try {
    const { menuId } = req.params;
    const { userId } = req.auth;

    const response = await UserDashboard().restaurantMenuDetails(userId, menuId);

    if (response.error) throwError(response.error, 401);

    return sendSuccess(res, response, 'Restaurants menu details fetched successfully', 200);
  } catch (err) {
    return sendError(res, err);
  }
};

module.exports = {
  featuredRestaurants,
  popularRestaurants,
  closeByRestaurants,
  allRestaurants,
  popularSearches,
  search,
  searchByCategory,
  restaurantDetails,
  restaurantMenus,
  restaurantMenuDetails,
};
