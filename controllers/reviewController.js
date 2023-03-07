// eslint-disable-next-line import/no-useless-path-segments
const AppError = require('../utils/appError');
// eslint-disable-next-line import/no-useless-path-segments
const Review = require('./../models/reviewModel');

// eslint-disable-next-line import/no-useless-path-segments
const catchAsync = require('./../utils/catchAsync');

// eslint-disable-next-line import/no-useless-path-segments
const Tour = require('./../models/tourModel');

// eslint-disable-next-line import/no-useless-path-segments
const User = require('./../models/userModel');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const review = await Review.find();

  if (!review) {
    return next(new AppError('No Tour Found', 404));
  }

  res.status(200).json({
    status: 'success',
    results: review.length,
    data: {
      review,
    },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;

  if (!req.body.user) req.body.user = req.user.id;

  const newReview = await Review.create({
    review: req.body.review,
    rating: req.body.rating,
    tour: req.body.tour,
    user: req.body.user,
  });

  res.status(201).json({
    status: 'success',
    data: {
      review: newReview,
    },
  });
});
