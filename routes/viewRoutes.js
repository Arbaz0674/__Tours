const express = require('express');

const router = express.Router();

// eslint-disable-next-line import/no-useless-path-segments
const viewController = require('./../controllers/viewsController');

// eslint-disable-next-line import/no-useless-path-segments
const authController = require('./../controllers/authController');

router.use(authController.isLoggedIn);

//Initial Page
router.get('/', viewController.getOverview);

//Create Route for Detail Page
router.route('/tours/:tourType').get(viewController.getTours);

//Login Page
router.route('/login').get(viewController.getloginForm);

module.exports = router;
