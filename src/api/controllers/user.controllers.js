const {
  sendError, sendSuccess, throwError,
} = require('../../utils');
const { User, Wallet } = require('../services');
const validations = require('../validations');

// Manual Signup ===> /api/users/signup
const signup = async (req, res) => {
  try {
    await validations.common.registerSchema.validateAsync(req.body);

    const response = await User().signup(req.body);

    if (response.error) throwError(response.error, 401);

    await Wallet().createWallet(response.userId);

    return sendSuccess(res, response, 'User created successfully', 201);
  } catch (err) {
    if (err.isJoi === true) {
      return sendError(res, { ...err.details[0], statusCode: 422 });
    }
    return sendError(res, err);
  }
};

// Verify account ===> /api/users/verify-account
const verifyAccount = async (req, res) => {
  try {
    await validations.common.verifyTokenSchema.validateAsync(req.body);

    const response = await User().verifyAccount(req.body);

    if (response.error) throwError(response.error, 401);

    return sendSuccess(res, response, 'User account verified successfully', 200);
  } catch (err) {
    if (err.isJoi === true) {
      return sendError(res, { ...err.details[0], statusCode: 422 });
    }
    return sendError(res, err);
  }
};

// Resend Verification token ===> /api/users/resend-token
const resendToken = async (req, res) => {
  try {
    const { userId } = req.auth;

    const response = await User().resendToken(userId);

    if (response.error) throwError(response.error, 401);

    return sendSuccess(res, {}, 'Verification token sent', 200);
  } catch (err) {
    if (err.isJoi === true) {
      return sendError(res, { ...err.details[0], statusCode: 422 });
    }
    return sendError(res, err);
  }
};

// Manual Login ===> /api/users/login
const login = async (req, res) => {
  try {
    await validations.common.loginSchema.validateAsync(req.body);

    const response = await User().login(req.body);

    if (response.error) throwError(response.error, 401);

    return sendSuccess(res, response, 'login successfull', 200);
  } catch (err) {
    if (err.isJoi === true) {
      return sendError(res, { ...err.details[0], statusCode: 422 });
    }
    return sendError(res, err);
  }
};

// Update profile ===> /api/users/update-profile
const updateProfile = async (req, res) => {
  try {
    await validations.user.updateProfileSchema.validateAsync(req.body);

    const response = await User().updateProfile(req.auth.userId, req.body);

    if (response.error) throwError(response.error, 401);

    return sendSuccess(res, response, 'Account updated successfully', 200);
  } catch (err) {
    if (err.isJoi === true) {
      return sendError(res, { ...err.details[0], statusCode: 422 });
    }
    return sendError(res, err);
  }
};

// Get user ===> /api/users/:userId
const getUser = async (req, res) => {
  try {
    await validations.common.mongoObjectId.validateAsync(req.params.userId);

    const response = await User().getUser(req.params.userId);

    if (response.error) throwError(response.error, 401);

    return sendSuccess(res, response, 'User details fetched successfully', 200);
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
    await validations.common.forgotPasswordSchema.validateAsync(req.body);

    const response = await User().forgotPassword(req.body);

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

    const response = await User().resetPassword(req.body);

    if (response.error) throwError(response.error, 401);

    return sendSuccess(res, {}, 'Password reset successful', 202);
  } catch (err) {
    if (err.isJoi === true) {
      return sendError(res, { ...err.details[0], statusCode: 422 });
    }
    return sendError(res, err);
  }
};

const getGoogleUrl = async (req, res) => {
  try {
    const response = await User().getGoogleUrl(req);

    if (response.error) throwError(response.error, 401);

    return sendSuccess(res, { url: response }, 'Url gotten successfully', 202);
  } catch (err) {
    if (err.isJoi === true) {
      return sendError(res, { ...err.details[0], statusCode: 422 });
    }
    return sendError(res, err);
  }
};

// this is used by both login with google and register with google
const googleDetails = async (req, res) => {
  try {
    const referredByGoogle = await validations.common.referedByGoogle(req);

    if (!referredByGoogle) throwError('Only google should access this link', 401);
    // eslint-disable-next-line prefer-const
    let { code, action } = req.query;
    // if there is default action in the query, pass it else set action to register
    action ? null : action = 'register';
    const response = await User().googleDetails(code, action);
    if (response.error) throwError(response.error, 401);

    return sendSuccess(res, response, action === 'login' ? 'login successfull' : 'Details gotten successfully', 202);
  } catch (err) {
    if (err.isJoi === true) {
      return sendError(res, { ...err.details[0], statusCode: 422 });
    }
    return sendError(res, err);
  }
};

module.exports = {
  signup,
  login,
  verifyAccount,
  resendToken,
  updateProfile,
  getUser,
  forgotPassword,
  resetPassword,
  getGoogleUrl,
  googleDetails,
};
