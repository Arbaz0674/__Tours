// eslint-disable-next-line import/no-useless-path-segments
const AppError = require('../utils/appError');
// eslint-disable-next-line import/no-useless-path-segments
const Review = require('./../models/reviewModel');

// eslint-disable-next-line import/no-useless-path-segments
// const catchAsync = require('./../utils/catchAsync');

// eslint-disable-next-line import/no-useless-path-segments
const Tour = require('./../models/tourModel');

// eslint-disable-next-line import/no-useless-path-segments
const User = require('./../models/userModel');

const factory = require('./factoryhandler');

exports.setTourUserIds = (req, res, next) => {
  //Allow Nested Routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);

exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
