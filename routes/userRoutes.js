const express = require('express');

// eslint-disable-next-line import/no-useless-path-segments
const authController = require('./../controllers/authController');
// eslint-disable-next-line import/no-useless-path-segments
const userController = require('./../controllers/userController');

const {
  uploadUserPhoto,
  resizeUserPhoto,
  getAllUsers,
  updateMe,
  deleteMe,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} = userController;
const router = express.Router();

router.post('/signup', authController.signup);

router.post('/login', authController.login);

router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);

router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect);

router.patch('/updatePassword', authController.updatePassword);

router.get(
  '/me',
  authController.protect,
  userController.getMe,
  userController.getUser
);

router.patch('/updateMe', uploadUserPhoto, resizeUserPhoto, updateMe);

router.delete('/deleteMe', deleteMe);

router.use(authController.restrictTo('admin'));

router.route('/').get(getAllUsers).post(createUser);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
