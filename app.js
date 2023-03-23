//Core Modules of Node
const path = require('path');
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

// eslint-disable-next-line import/no-extraneous-dependencies
const cookieParser = require('cookie-parser');

//Importing our modules
//Error Class Definition
const AppError = require('./utils/appError');
//Error Handler
const globalErrorHandler = require('./controllers/errorController');

const tourRouter = require('./routes/tourRoutes');

const userRouter = require('./routes/userRoutes');

const reviewRouter = require('./routes/reviewRoutes');

const viewRouter = require('./routes/viewRoutes');

const bookingRouter = require('./routes/bookingRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//1)GLOBAL MIDDLEWARES

//Serving Static Files
app.use(express.static(path.join(__dirname, 'public')));

//Set Security HTTP headers
// app.use(helmet()); // helmet() returns a function which will acts as a middleware
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

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
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

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

//Test Middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

//Defining subApp Middleware for Routing to Specific Resource
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Page ${req.originalUrl} Not Found`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
