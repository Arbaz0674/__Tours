const express = require('express');

// eslint-disable-next-line import/no-useless-path-segments
const authController = require('./../controllers/authController');
// eslint-disable-next-line import/no-useless-path-segments
const userController = require('./../controllers/userController');

const { getAllUsers, updateMe, createUser, getUser, updateUser, deleteUser } =
  userController;
const router = express.Router();

router.post('/signup', authController.signup);

router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);

router.patch('/resetPassword/:token', authController.resetPassword);

router.patch(
  '/updatePassword',
  authController.protect,
  authController.updatePassword
);

router.patch('/updateMe', authController.protect, updateMe);

router.route('/').get(getAllUsers).post(createUser);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
