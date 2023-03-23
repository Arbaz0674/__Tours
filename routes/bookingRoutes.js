const express = require('express');

// eslint-disable-next-line import/no-useless-path-segments
const authController = require('./../controllers/authController');

// eslint-disable-next-line import/no-useless-path-segments
const bookingController = require('./../controllers/bookingController');

const router = express.Router();

router.use(authController.protect);

router.get('/checkout-session/:tourID', bookingController.getCheckoutSession);

router.use(authController.restrictTo('admin', 'lead-guide'));

router
  .route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.deleteBooking);

module.exports = router;
