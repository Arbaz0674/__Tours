// eslint-disable-next-line import/no-useless-path-segments
const AppError = require('../utils/appError');
// eslint-disable-next-line import/no-useless-path-segments
const User = require('./../models/userModel');

// eslint-disable-next-line import/no-useless-path-segments
const catchAsync = require('./../utils/catchAsync');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((keys) => {
    if (allowedFields.includes(keys)) newObj[keys] = obj[keys];
  });

  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    data: {
      users,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  //1)Create error if user POSTS password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        `You cannot change password from here,Kindly use different link`,
        400
      )
    );
  }

  //2)Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  //2)Update user document

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route has not yet defined',
  });
};
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route has not yet defined',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route has not yet defined',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route has not yet defined',
  });
};