const express = require('express');

const router = express.Router();

// eslint-disable-next-line import/no-useless-path-segments
const viewController = require('./../controllers/viewsController');

router.get('/', viewController.getOverview);

//Create Route for Detail Page

router.route('/tours/:tourType').get(viewController.getTours);

module.exports = router;
