// Core Dependencies
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const helmet = require('helmet');
const { NODE_ENV, BASE_URL } = require('./config');
const InitiateMongoServer = require('./config/db');

// Instance of express
const app = express();

const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'JemiEats API documentation',
    version: '1.0.1',
    description: 'JemiEats API documentation',
    contact: {
      name: 'API Support',
      email: 'support@jemiEats',
    },
  },
  servers: [
    {
      url: `${BASE_URL}/api`,
      description: 'Development server',
    },
  ],
};
// options for the swagger docs
const options = {
  // import swaggerDefinitions
  swaggerDefinition,
  // path to the API docs
  apis: ['./src/docs/*.yaml'],
};
// initialize swagger-jsdoc
const swaggerSpec = swaggerJsDoc(options);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Initiate Database Connection
InitiateMongoServer();

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf.toString('utf8');
  },
}));
app.use(cors({
  credentials: true, methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', preflightContinue: false, origin: '*',
}));

// logging
if (NODE_ENV === 'DEVELOPMENT') {
  app.use(morgan('dev'));
  app.use(helmet());
} else {
  app.use(morgan('tiny'));
}

// Routers
const baseRouter = require('./api/routes');
const userRouter = require('./api/routes/user.routes');
const vendorCategoryRouter = require('./api/routes/vendor.category.routes');
const vendorRouter = require('./api/routes/vendor.routes');
const userDashboardRouter = require('./api/routes/user.dashboard.routes');
const menuRouter = require('./api/routes/menu.routes');
const cartRouter = require('./api/routes/cart.routes');
const cardRouter = require('./api/routes/card.routes');
const orderRouter = require('./api/routes/order.routes');
const transactionRouter = require('./api/routes/transaction.routes');
const addressRouter = require('./api/routes/address.routes');
const walletRouter = require('./api/routes/wallet.routes');

// Routes
app.use('/', baseRouter);
app.use('/api', vendorRouter);
app.use('/api', userRouter);
app.use('/api', vendorCategoryRouter);
app.use('/api', userDashboardRouter);
app.use('/api', menuRouter);
app.use('/api', cartRouter);
app.use('/api', cardRouter);
app.use('/api', orderRouter);
app.use('/api', transactionRouter);
app.use('/api', addressRouter);
app.use('/api', walletRouter);

module.exports = app;
