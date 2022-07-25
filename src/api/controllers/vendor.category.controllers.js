const {
  sendError, sendSuccess, throwError,
} = require('../../utils');
const { VendorCategory } = require('../services/vendor.category.services');
const validations = require('../validations');

// Create vendor category ===> /api/categories/vendors/create
const createVendorCategory = async (req, res) => {
  try {
    await validations.category.createCategorySchema.validateAsync(req.body);

    const { category } = req.body;

    const response = await VendorCategory().createVendorCategory(category);

    if (response.error) throwError(response.error, 401);

    return sendSuccess(res, response, 'Category created successfully', 201);
  } catch (err) {
    if (err.isJoi === true) {
      return sendError(res, { ...err.details[0], statusCode: 422 });
    }
    return sendError(res, err);
  }
};

// Create many vendor category ===> /api/categories/vendors/createMany
const createManyVendorCategory = async (req, res) => {
  try {
    // await validations.category.createCategorySchema.validateAsync(req.body);

    const { categories } = req.body;

    const response = await VendorCategory().createManyVendorCategory(categories);

    if (response.error) throwError(response.error, 401);

    return sendSuccess(res, response, 'Category created successfully', 201);
  } catch (err) {
    // if (err.isJoi === true) {
    //   return sendError(res, { ...err.details[0], statusCode: 422 });
    // }
    return sendError(res, err);
  }
};

// Get all vendor categories ===> /api/categories/vendors/all
const allVendorCategories = async (req, res) => {
  try {
    const response = await VendorCategory().allVendorCategories();

    if (response.error) throwError(response.error, 401);

    return sendSuccess(res, response, 'Categories fetched successfully', 200);
  } catch (err) {
    return sendError(res, err);
  }
};

// Get a single vendor category ===> /api/category/vendors/:catId
const getVendorCategory = async (req, res) => {
  try {
    await validations.common.mongoObjectId.validateAsync(req.params.catId);

    const { catId } = req.params;

    const response = await VendorCategory().getVendorCategory(catId);

    if (response.error) throwError(response.error, 401);

    return sendSuccess(res, response, 'Category fetched', 200);
  } catch (err) {
    if (err.isJoi === true) {
      return sendError(res, { ...err.details[0], statusCode: 422 });
    }
    return sendError(res, err);
  }
};

// Update a single vendor categories ===> /api/categories/vendors/:catId
const updateVendorCategory = async (req, res) => {
  try {
    await validations.common.mongoObjectId.validateAsync(req.params.catId);
    await validations.category.createCategorySchema.validateAsync(req.body);

    const payload = {
      id: req.params.catId,
      category: req.body.category,
    };

    const response = await VendorCategory().updateVendorCategory(payload);

    if (response.error) throwError(response.error, 401);

    return sendSuccess(res, response, 'Category updated', 202);
  } catch (err) {
    if (err.isJoi === true) {
      return sendError(res, { ...err.details[0], statusCode: 422 });
    }
    return sendError(res, err);
  }
};

// Delete a single vendor categories ===> /api/categories/vendors/:catId
const deleteVendorCategory = async (req, res) => {
  try {
    await validations.common.mongoObjectId.validateAsync(req.params.catId);

    const response = await VendorCategory().deleteVendorCategory(req.params.catId);

    if (response.error) throwError(response.error, 401);

    return sendSuccess(res, {}, 'Category deleted', 200);
  } catch (err) {
    if (err.isJoi === true) {
      return sendError(res, { ...err.details[0], statusCode: 422 });
    }
    return sendError(res, err);
  }
};

// Create many meal category ===> /api/categories/meals/createMany
const createManyMealCategory = async (req, res) => {
  try {
    // await validations.category.createCategorySchema.validateAsync(req.body);

    const { meals } = req.body;

    const response = await VendorCategory().createManyMealCategory(meals);

    if (response.error) throwError(response.error, 401);

    return sendSuccess(res, response, 'Category created successfully', 201);
  } catch (err) {
    // if (err.isJoi === true) {
    //   return sendError(res, { ...err.details[0], statusCode: 422 });
    // }
    return sendError(res, err);
  }
};

module.exports = {
  createVendorCategory,
  createManyVendorCategory,
  allVendorCategories,
  getVendorCategory,
  updateVendorCategory,
  deleteVendorCategory,
  createManyMealCategory,
};
