// eslint-disable-next-line import/no-extraneous-dependencies
const multer = require('multer');

// eslint-disable-next-line import/no-extraneous-dependencies
const sharp = require('sharp');

// eslint-disable-next-line import/no-useless-path-segments
const AppError = require('../utils/appError');
// eslint-disable-next-line import/no-useless-path-segments
const User = require('./../models/userModel');

// eslint-disable-next-line import/no-useless-path-segments
const catchAsync = require('./../utils/catchAsync');

const factory = require('./factoryhandler');

// Code for Storing Photos in Disk
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     //cb acts as a middleware in multer
//     //user-user_id-timestamp.file_ext
//     const ext = file.mimetype.split('/')[1]; //mimetype : 'image/jpeg'
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });

//Code for Storing Photos in Memory
const multerStorage = multer.memoryStorage();

//Function to check whether file is an image or not
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError(`Not an Image!Please Upload only Images.`, 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single('photo'); // Given Upload.single is a built-in middleware

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((keys) => {
    if (allowedFields.includes(keys)) newObj[keys] = obj[keys];
  });

  return newObj;
};

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
  if (req.file) filteredBody.photo = req.file.filename;
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

exports.getAllUsers = factory.getAll(User);
exports.deleteMe = factory.deleteOne(User);
// exports.deleteMe = catchAsync(async (req, res, next) => {
//   await User.findByIdAndUpdate(req.user.id, { active: false });

//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// });

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route has not yet defined',
  });
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.getUser = factory.getOne(User);
//Do not update passwords with this!
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
