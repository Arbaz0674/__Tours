const express = require('express');

// eslint-disable-next-line import/no-useless-path-segments
const authController = require('./../controllers/authController');

// eslint-disable-next-line import/no-useless-path-segments
const bookingController = require('./../controllers/bookingController');

const router = express.Router();

router.get(
  '/checkout-session/:tourID',
  authController.protect,
  bookingController.getCheckoutSession
);

module.exports = router;
