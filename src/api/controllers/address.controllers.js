const { sendError, sendSuccess } = require('../../utils');
const { Address } = require('../services');
const validations = require('../validations');

const createAddress = async (req, res) => {
  try {
    await validations.address.createAddressSchema.validateAsync(req.body);
    const { userId } = req.auth;
    req.body.userId = userId;
    const address = await Address().createAddress(req.body);
    return sendSuccess(res, { address }, 'Address created successfully', 201);
  } catch (err) {
    if (err.isJoi === true) {
      return sendError(res, { ...err.details[0], statusCode: 422 });
    }
    return sendError(res, err);
  }
};

const getAllAddress = async (req, res) => {
  try {
    const { userId } = req.auth;
    req.body.userId = userId;
    const address = await Address().getAllAddress(userId);
    return sendSuccess(res, { address }, 'Address fetched successfully', 200);
  } catch (err) {
    return sendError(res, err);
  }
};

const getAddressById = async (req, res) => {
  try {
    const { id } = req.params;
    const address = await Address().getAddressById(id);
    return sendSuccess(res, { address }, 'Address fetched successfully', 200);
  } catch (err) {
    return sendError(res, err);
  }
};

const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    await Address().deleteAddress(id);
    return sendSuccess(res, { }, 'Address deleted successfully', 200);
  } catch (err) {
    return sendError(res, err);
  }
};

const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.auth;
    const address = await Address().updateAddress(id, userId);
    return sendSuccess(res, { address }, 'Address updated successfully', 200);
  } catch (err) {
    return sendError(res, err);
  }
};

module.exports = {
  createAddress,
  getAllAddress,
  getAddressById,
  deleteAddress,
  updateAddress,
};
