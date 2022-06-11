// Error Handler Class
class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

function throwError(message, statusCode) {
  throw new ErrorHandler(message, statusCode);
}

const handleCastErrorExceptionForInvalidObjectId = () => throwError('Invalid Parameter. Resource Not Found');

const isCastError = (error = '') => error.toString().indexOf('CastError') !== -1;

module.exports = { throwError, handleCastErrorExceptionForInvalidObjectId, isCastError };
