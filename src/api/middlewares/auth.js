const { jwtManager } = require('../../utils/tokenizer');
const { throwError } = require('../../utils/handle-error');
const { sendError } = require('../../utils/response-handler');
const logger = require('../../utils/logger');

// eslint-disable-next-line consistent-return
const authenticate = async (req, res, next) => {
  try {
    const requestHeaderAuthorization = req.headers.authorization;

    if (!requestHeaderAuthorization) {
      throwError('Authentication Failed. Please login', 401);
    }

    const [authBearer, token] = requestHeaderAuthorization.split(' ');

    if (authBearer !== 'Bearer') {
      throwError('Authentication Failed, Bearer token missing', 400);
    }

    const data = await jwtManager().verify(token);

    req.auth = data;
    next();
  } catch (error) {
    logger.log({
      level: 'error',
      message: error.message,
    });
    return sendError(res, error);
  }
};

// const permit = (users) => (req, res, next) => {
//   try {
//     const isAuthorized = users.includes(req.auth.role);

//     if (!isAuthorized) {
//       throwError('Unauthorized request', 401);
//     }

//     next();
//   } catch (err) {
//     sendError(res, err);
//   }
// };

module.exports = {
  authenticate,
};
