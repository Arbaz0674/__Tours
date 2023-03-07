//Core Modules of Node
const express = require('express');
const morgan = require('morgan');

// eslint-disable-next-line import/no-extraneous-dependencies
const rateLimit = require('express-rate-limit');

// eslint-disable-next-line import/no-extraneous-dependencies
const helmet = require('helmet');

// eslint-disable-next-line import/no-extraneous-dependencies
const mongoSanitize = require('express-mongo-sanitize');

// eslint-disable-next-line import/no-extraneous-dependencies
const xss = require('xss-clean');

// eslint-disable-next-line import/no-extraneous-dependencies
const hpp = require('hpp'); //HTML Parameter Pollution

//Importing our modules
//Error Class Definition
const AppError = require('./utils/appError');
//Error Handler
const globalErrorHandler = require('./controllers/errorController');

const tourRouter = require('./routes/tourRoutes');

const userRouter = require('./routes/userRoutes');

const reviewRouter = require('./routes/reviewRoutes');

const app = express();

//1)GLOBAL MIDDLEWARES
//Set Security HTTP headers
app.use(helmet()); // helmet() returns a function which will acts as a middleware
console.log(process.env.NODE_ENV);

//Development Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Use to decide no of request can be made to server at given amount of time
const limiter = rateLimit({
  max: 100, //No of request
  windowMs: 60 * 60 * 1000, //Time Limit Under which no of request limit can be made.
  message: 'Too many requests from this IP,please try again in an hour!',
});
app.use('/api', limiter);

//Body Parser :- Reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

//Data Sanitization against NoSQL query injection
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(xss());

app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
); //Clear up query string

//Serving Static Files
app.use(express.static(`${__dirname}/public`));

//Test Middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.headers);
  next();
});

// Routes
//Defining subApp Middleware for Routing to Specific Resource
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Page ${req.originalUrl} Not Found`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
