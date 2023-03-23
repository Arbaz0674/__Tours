const express = require('express');

const router = express.Router();

// eslint-disable-next-line import/no-useless-path-segments
const viewController = require('./../controllers/viewsController');

// eslint-disable-next-line import/no-useless-path-segments
const authController = require('./../controllers/authController');

// eslint-disable-next-line import/no-useless-path-segments
const bookingController = require('./../controllers/bookingController');

//Initial Page
router.get(
  '/',
  bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewController.getOverview
);

//Create Route for Detail Page
router
  .route('/tours/:tourType')
  .get(authController.isLoggedIn, viewController.getTours);

//Login Page
router
  .route('/login')
  .get(authController.isLoggedIn, viewController.getloginForm);

router.get('/me', authController.protect, viewController.getAccount);

router.get('/my-tours', authController.protect, viewController.getMyTours);

router.post(
  '/submit-user-data',
  authController.protect,
  viewController.updateUserData
);

module.exports = router;
