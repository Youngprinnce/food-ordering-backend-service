const { sendError, sendSuccess, throwError } = require('../../utils');
const { Cart } = require('../services/cart.services');
const validations = require('../validations');

const addItemToCart = async (req, res) => {
  try {
    await validations.cart.addItemToCartSchema.validateAsync(req.body);

    req.body.userId = req.auth.userId;

    const response = await Cart().addItemToCart(req.body);

    if (response.error) throwError(response.error, 401);

    return sendSuccess(res, response, 'item added to cart successfully', 201);
  } catch (err) {
    if (err.isJoi === true) {
      return sendError(res, { ...err.details[0], statusCode: 422 });
    }
    return sendError(res, err);
  }
};

const getCartItems = async (req, res) => {
  try {
    const response = await Cart().getCartItems(req.auth.userId);

    if (response.error) throwError(response.error, 404);

    return sendSuccess(res, response, 'Cart fetched successfully', 200);
  } catch (err) {
    return sendError(res, err);
  }
};

const changeCartItemQuantity = async (req, res) => {
  try {
    await validations.cart.changeCartItemQuantity.validateAsync(req.params);

    const obj = {
      userId: req.auth.userId,
      itemId: req.params.itemId,
      status: req.params.status,
    };

    const response = await Cart().changeCartItemQuantity(obj);

    if (response.error) throwError(response.error, 404);

    return sendSuccess(res, response, 'Cart item quantity changed', 200);
  } catch (err) {
    if (err.isJoi === true) {
      return sendError(res, { ...err.details[0], statusCode: 422 });
    }
    return sendError(res, err);
  }
};

const updateCart = async (req, res) => {
  try {
    await validations.cart.updateCart.validateAsync(req.body);

    req.body.userId = req.auth.userId;

    const response = await Cart().updateCart(req.body);

    if (response.error) throwError(response.error, 404);

    return sendSuccess(res, response, 'Cart updated successfully', 200);
  } catch (err) {
    if (err.isJoi === true) {
      return sendError(res, { ...err.details[0], statusCode: 422 });
    }
    return sendError(res, err);
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const obj = {
      userId: req.auth.userId,
      itemId: req.params.itemId,
    };

    const response = await Cart().deleteCartItem(obj);

    if (response.error) throwError(response.error, 404);

    return sendSuccess(res, response, 'Cart item deleted successfully', 200);
  } catch (err) {
    return sendError(res, err);
  }
};

module.exports = {
  addItemToCart,
  getCartItems,
  changeCartItemQuantity,
  updateCart,
  deleteCartItem,
};
