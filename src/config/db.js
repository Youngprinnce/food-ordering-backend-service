const mongoose = require('mongoose');
const logger = require('../utils/logger');
const { DATABASE_URL } = require('./index');
const { throwError } = require('../utils/handle-error');

const InitiateMongoServer = async () => {
  try {
    await mongoose.connect(DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info('Connected to DB');
  } catch (ex) {
    logger.log({
      level: 'error',
      message: ex.message,
    });
    throwError(ex.message, 500);
  }
};

module.exports = InitiateMongoServer;
