//Core Modules of Node
const express = require('express');
const morgan = require('morgan');

//Importing our modules
//Error Class Definition
const AppError = require('./utils/appError');
//Error Handler
const globalErrorHandler = require('./controllers/errorController');

const tourRouter = require('./routes/tourRoutes');

const userRouter = require('./routes/userRoutes');

const app = express();

console.log(process.env.NODE_ENV);
//1.MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.headers);
  next();
});
// Routes
//Defining subApp Middleware for Routing to Specific Resource
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Page ${req.originalUrl} Not Found`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
