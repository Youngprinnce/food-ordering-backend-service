const {
  sendError, sendSuccess, throwError, uploadFile,
} = require('../../utils');
const { Vendor } = require('../services/vendor.services');
const validations = require('../validations');

// Signup Step one ===> /api/vendors/signup/step-one
const signupStepOne = async (req, res) => {
  try {
    await validations.common.registerSchema.validateAsync(req.body);

    const response = await Vendor().signupStepOne(req.body);

    if (response.error) throwError(response.error, 401);

    return sendSuccess(res, response, 'Vendor Owner created successfully', 201);
  } catch (err) {
    if (err.isJoi === true) {
      return sendError(res, { ...err.details[0], statusCode: 422 });
    }
    return sendError(res, err);
  }
};

// Verify account ===> /api/vendors/verify-account
const verifyAccount = async (req, res) => {
  try {
    await validations.common.verifyTokenSchema.validateAsync(req.body);

    const response = await Vendor().verifyAccount(req.body);

    if (response.error) throwError(response.error, 401);

    return sendSuccess(res, response, 'Vendor Owner account verified successfully', 200);
  } catch (err) {
    if (err.isJoi === true) {
      return sendError(res, { ...err.details[0], statusCode: 422 });
    }
    return sendError(res, err);
  }
};

// Resend Verification token ===> /api/vendors/resend-token
const resendToken = async (req, res) => {
  try {
    const response = await Vendor().resendToken(req.auth.vendorId);

    if (response.error) throwError(response.error, 401);

    return sendSuccess(res, {}, 'Verification token sent', 200);
  } catch (err) {
    if (err.isJoi === true) {
      return sendError(res, { ...err.details[0], statusCode: 422 });
    }
    return sendError(res, err);
  }
};

// Signup Step one ===> /api/vendors/signup/step-two
const signupStepTwo = async (req, res) => {
  try {
    // await validations.vendor.stepTwoSignupSchema.validateAsync(req.body);
    // Get all the files from the request
    if (req.files) {
      const vendorLogo = req.files.vendorLogo[0];
      const vendorBannerImage = req.files.vendorBannerImage[0];
      const identificationImage = req.files.identificationImage[0];
      const vendorCertificateImage = req.files.vendorCertificateImage[0];
      const vendorMenu = req.files.vendorMenu[0];

      // If file exists, upload it to the server
      vendorLogo ? req.body.vendorLogo = await uploadFile(vendorLogo.path) : null;
      vendorBannerImage
        ? req.body.vendorBannerImage = await uploadFile(vendorBannerImage.path) : null;
      identificationImage
        ? req.body.identificationImage = await uploadFile(identificationImage.path) : null;
      vendorCertificateImage
        ? req.body.vendorCertificateImage = await uploadFile(vendorCertificateImage.path) : null;
      vendorMenu ? req.body.vendorMenu = await uploadFile(vendorMenu.path) : null;
    }

    const response = await Vendor().signupStepTwo(req.auth.vendorId, req.body);

    if (response.error) throwError(response.error, 401);

    return sendSuccess(res, response, 'Vendor registration successfull', 200);
  } catch (err) {
    if (err.isJoi === true) {
      return sendError(res, { ...err.details[0], statusCode: 422 });
    }
    return sendError(res, err);
  }
};

// Vendor login ===> /api/vendors/login
const login = async (req, res) => {
  try {
    await validations.common.loginSchema.validateAsync(req.body);

    const response = await Vendor().login(req.body);

    if (response.error) throwError(response.error, 401);

    return sendSuccess(res, response, 'Vendor registration successfull', 200);
  } catch (err) {
    if (err.isJoi === true) {
      return sendError(res, { ...err.details[0], statusCode: 422 });
    }
    return sendError(res, err);
  }
};

// Forgot password ===> /api/users/forgot-password
const forgotPassword = async (req, res) => {
  try {
    console.log('am here');
    await validations.common.forgotPasswordSchema.validateAsync(req.body);

    const response = await Vendor().forgotPassword(req.body);

    if (response.error) throwError(response.error, 401);

    return sendSuccess(res, {}, 'Reset token sent successfuly', 202);
  } catch (err) {
    if (err.isJoi === true) {
      return sendError(res, { ...err.details[0], statusCode: 422 });
    }
    return sendError(res, err);
  }
};

// Reset password ===> /api/users/reset-password
const resetPassword = async (req, res) => {
  try {
    await validations.common.resetPasswordSchema.validateAsync(req.body);

    const response = await Vendor().resetPassword(req.body);

    if (response.error) throwError(response.error, 401);

    return sendSuccess(res, {}, 'Password reset successful', 202);
  } catch (err) {
    if (err.isJoi === true) {
      return sendError(res, { ...err.details[0], statusCode: 422 });
    }
    return sendError(res, err);
  }
};

// Get vendor ===> /api/vendors/:vendorId
const getVendor = async (req, res) => {
  try {
    await validations.common.mongoObjectId.validateAsync(req.params.vendorId);

    const response = await Vendor().getVendor(req.params.vendorId);

    if (response.error) throwError(response.error, 401);

    return sendSuccess(res, response, 'Vendor details fetched successfully', 200);
  } catch (err) {
    if (err.isJoi === true) {
      return sendError(res, { ...err.details[0], statusCode: 422 });
    }
    return sendError(res, err);
  }
};

// update store details ===> /api/vendors/:vendorId
const updateVendor = async (req, res) => {
  try {
    await validations.vendor.updateStore.validateAsync(req.body);

    req.body.vendorId = req.params.vendorId;

    const response = await Vendor().updateVendor(req.body);

    if (response.error) throwError(response.error, 401);

    return sendSuccess(res, response, 'Vendor details updated successfully', 200);
  } catch (err) {
    if (err.isJoi === true) {
      return sendError(res, { ...err.details[0], statusCode: 422 });
    }
    return sendError(res, err);
  }
};

const addMenu = async (req, res) => {
  try {
    await validations.vendor.addMenu.validateAsync(req.body);
    // Get all the files from the request
    if (req.file && req.file.path) {
      const url = await uploadFile(req.file.path);
      req.body.image = url;
    }
    req.body.vendorId = req.auth.vendorId;
    const response = await Vendor().addMenu(req.body);

    if (response.error) throwError(response.error, 400);

    return sendSuccess(res, response, 'Menu added successfully', 201);
  } catch (err) {
    if (err.isJoi === true) {
      return sendError(res, { ...err.details[0], statusCode: 422 });
    }
    return sendError(res, err);
  }
};

const getAllMenu = async (req, res) => {
  try {
    const response = await Vendor().getAllMenu(req.auth.vendorId);

    if (response.error) throwError(response.error, 400);

    return sendSuccess(res, response, 'Vendor menu fetched Successfuly', 200);
  } catch (err) {
    return sendError(res, err);
  }
};

const getMenu = async (req, res) => {
  try {
    await validations.common.mongoObjectId.validateAsync(req.params.menuId);
    const response = await Vendor().getMenu(req.auth.vendorId, req.params.menuId);

    if (response.error) throwError(response.error, 400);

    return sendSuccess(res, response, 'Menu fetched Successfuly', 200);
  } catch (err) {
    if (err.isJoi === true) {
      return sendError(res, { ...err.details[0], statusCode: 422 });
    }
    return sendError(res, err);
  }
};

const updateMenu = async (req, res) => {
  try {
    await validations.vendor.updateMenu.validateAsync(req.body);
    await validations.common.mongoObjectId.validateAsync(req.params.menuId);

    const obj = {
      vendorId: req.auth.vendorId,
      menuId: req.params.menuId,
    };
    const response = await Vendor().updateMenu(obj, req.body);

    if (response.error) throwError(response.error, 400);

    return sendSuccess(res, response, 'Menu updated', 200);
  } catch (err) {
    if (err.isJoi === true) {
      return sendError(res, { ...err.details[0], statusCode: 422 });
    }
    return sendError(res, err);
  }
};

const addCombo = async (req, res) => {
  try {
    await validations.vendor.addCombo.validateAsync(req.body);

    req.body.vendorId = req.auth.vendorId;

    const response = await Vendor().addCombo(req.body);

    if (response.error) throwError(response.error, 400);

    return sendSuccess(res, response, 'Combo created succesfully', 201);
  } catch (err) {
    if (err.isJoi === true) {
      return sendError(res, { ...err.details[0], statusCode: 422 });
    }
    return sendError(res, err);
  }
};

const getAllCombo = async (req, res) => {
  try {
    const response = await Vendor().getAllCombo(req.auth.vendorId);

    if (response.error) throwError(response.error, 400);

    return sendSuccess(res, response, 'All combo fetched successfully', 200);
  } catch (err) {
    if (err.isJoi === true) {
      return sendError(res, { ...err.details[0], statusCode: 422 });
    }
    return sendError(res, err);
  }
};

const deleteCombo = async (req, res) => {
  try {
    await validations.common.mongoObjectId.validateAsync(req.params.comboId);

    const response = await Vendor().deleteCombo(req.params.comboId, req.auth.vendorId);

    if (response.error) throwError(response.error, 400);

    return sendSuccess(res, {}, 'Combo deleted successfully', 202);
  } catch (err) {
    if (err.isJoi === true) {
      return sendError(res, { ...err.details[0], statusCode: 422 });
    }
    return sendError(res, err);
  }
};

const changePassword = async (req, res) => {
  try {
    await validations.vendor.changePassword.validateAsync(req.body);

    const response = await Vendor().changePassword(req.auth.vendorId, req.body);

    if (response.error) throwError(response.error, 401);

    return sendSuccess(res, {}, 'Password Successfully changed', 202);
  } catch (err) {
    console.log(err);
    if (err.isJoi === true) {
      return sendError(res, { ...err.details[0], statusCode: 422 });
    }
    return sendError(res, err);
  }
};

const changeEmail = async (req, res) => {
  try {
    await validations.vendor.changeEmail.validateAsync(req.body);

    const response = await Vendor().changeEmail(req.auth.vendorId, req.body);

    if (response.error) throwError(response.error, 401);

    return sendSuccess(res, {}, 'Email Successfully changed', 202);
  } catch (err) {
    if (err.isJoi === true) {
      return sendError(res, { ...err.details[0], statusCode: 422 });
    }
    return sendError(res, err);
  }
};

const deleteMenu = async (req, res) => {
  try {
    await validations.common.mongoObjectId.validateAsync(req.params.menuId);

    const response = await Vendor().deleteMenu(req.params.menuId, req.auth.vendorId);

    if (response.error) throwError(response.error, 400);

    return sendSuccess(res, {}, 'Menu deleted successfully', 202);
  } catch (err) {
    if (err.isJoi === true) {
      return sendError(res, { ...err.details[0], statusCode: 422 });
    }
    return sendError(res, err);
  }
};

const updateOpeningHours = async (req, res) => {
  try {
    await validations.vendor.updateOpeningHours.validateAsync(req.body);

    const response = await Vendor().updateOpeningHours(req.auth.vendorId, req.body);

    if (response.error) throwError(response.error, 400);

    return sendSuccess(res, response, 'Opening hours updated', 200);
  } catch (err) {
    if (err.isJoi === true) {
      return sendError(res, { ...err.details[0], statusCode: 422 });
    }
    return sendError(res, err);
  }
};

module.exports = {
  signupStepOne,
  verifyAccount,
  resendToken,
  signupStepTwo,
  login,
  forgotPassword,
  resetPassword,
  getVendor,
  updateVendor,
  addMenu,
  getAllMenu,
  getMenu,
  updateMenu,
  addCombo,
  getAllCombo,
  deleteCombo,
  changePassword,
  changeEmail,
  deleteMenu,
  updateOpeningHours,
};
