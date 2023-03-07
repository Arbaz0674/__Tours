const express = require('express');

// eslint-disable-next-line import/no-useless-path-segments
const tourController = require('./../controllers/tourController');

// eslint-disable-next-line import/no-useless-path-segments
const authController = require('./../controllers/authController');

// eslint-disable-next-line import/no-useless-path-segments
const reviewController = require('./../controllers/reviewController');

const router = express.Router();

const {
  // checkID,
  aggregate,
  monthlyPlan,
  getAllTours,
  createTour,
  tour,
  updateTour,
  deleteTour,
} = tourController;

// router.param('id', checkID);
router.route('/aggregate-tours').get(aggregate);
router.route('/monthly-plan/:year').get(monthlyPlan);

router.route('/').get(authController.protect, getAllTours).post(createTour);

router
  .route('/:id')
  .get(tour)
  .patch(updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    deleteTour
  );

// POST  /tour/:tourId/reviews
router
  .route('/:tourId/reviews')
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview
  );

module.exports = router;
