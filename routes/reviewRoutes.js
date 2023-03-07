const express = require('express');

const router = express.Router();

// eslint-disable-next-line import/no-useless-path-segments
const reviewController = require('./../controllers/reviewController');

// eslint-disable-next-line import/no-useless-path-segments
const authController = require('./../controllers/authController');

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview
  );

module.exports = router;
