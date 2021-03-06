const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = require('../config');

// custom function to sign and verify token using jwt
module.exports = {
  jwtManager() {
    return {
      async sign(data) {
        return jwt.sign(data, JWT_SECRET_KEY, { expiresIn: '24h' });
      },
      async verify(token) {
        return jwt.verify(token, JWT_SECRET_KEY);
      },
    };
  },
};
