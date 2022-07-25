/* eslint-disable no-param-reassign */
// success message formate
const sendSuccess = (response, data = {}, message = '', code = 200) => {
  const resp = {
    success: true,
    message,
    data,
  };
  return response.status(code).json(resp);
};

// Error message handler and custom message for special error
const sendError = (response, error) => {
  let resp;

  if (process.env.NODE_ENV === 'production') {
    resp = {
      success: false,
      message: error.message || 'Internal Server Error',
      errorCode: error.statusCode || 500,
    };
  } else {
    let msg = '';
    // Handling Mongoose Validation Error
    if (error.name === 'ValidationError') {
      error.statusCode = 412;
      msg = Object.values(error.errors).map((value) => value.message);
    }

    // Handling wrong JWT error
    if (error.name === 'JsonWebTokenError') {
      msg = 'JSON Web Token is invalid. Try Again!!!';
    }

    // Handling Expired JWT error
    if (error.name === 'TokenExpiredError') {
      error.statusCode = 413;
      msg = 'JSON Web Token is expired. Try Again!!!';
    }

    // Handling Expired JWT error
    if (error.name === 'MongoError') {
      error.statusCode = 413;
      msg = error.message;
    }

    resp = {
      success: false,
      message: error.message || msg || 'Internal Server Error',
      errorCode: error.statusCode || 500,
      stack: error.stack,
    };
  }

  return response.status(error.statusCode || 500).json(resp);
};

module.exports = { sendSuccess, sendError };
