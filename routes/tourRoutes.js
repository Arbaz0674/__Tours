const express = require('express');

// eslint-disable-next-line import/no-useless-path-segments
const tourController = require('./../controllers/tourController');

// eslint-disable-next-line import/no-useless-path-segments
const authController = require('./../controllers/authController');

// eslint-disable-next-line import/no-useless-path-segments
const reviewRouter = require('./../routes/reviewRoutes');

// POST  /tour/:tourId/reviews
// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview
//   );

const router = express.Router();

// POST  /tour/:tourId/reviews
// GET  /tour/:tourId/reviews
router.use('/:tourId/reviews', reviewRouter);

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
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    monthlyPlan
  );

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router
  .route('/')
  .get(authController.protect, getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    createTour
  );

router
  .route('/:id')
  .get(tour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    deleteTour
  );

module.exports = router;
