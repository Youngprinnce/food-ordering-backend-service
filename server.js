const { createServer } = require('http');
const app = require('./src/app');
const { PORT } = require('./src/config');

const logger = require('./src/utils/logger');

// Spin server
const server = createServer(app);
server.listen(PORT, () => logger.info(`Server listening on port ${PORT}`));

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.log({
    level: 'error',
    message: err.message,
  });
  logger.info('Shutting down due to uncaught exception');
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.log({
    level: 'error',
    message: err.message,
  });
  // Close server & exit process
  logger.info('Shutting down the server due to Unhandled Promise rejection');
  server.close(() => process.exit(1));
});
