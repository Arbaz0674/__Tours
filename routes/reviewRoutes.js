const express = require('express');

const router = express.Router({ mergeParams: true }); // Reserves parameter of parent URL

// eslint-disable-next-line import/no-useless-path-segments
const reviewController = require('./../controllers/reviewController');

// eslint-disable-next-line import/no-useless-path-segments
const authController = require('./../controllers/authController');

// POST  /tour/:tourId/reviews
// GET  /tour/:tourId/reviews

router.use(authController.protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview
  );

module.exports = router;
