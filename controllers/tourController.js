// eslint-disable-next-line import/no-useless-path-segments
const Tour = require('./../models/tourModel');
// eslint-disable-next-line import/no-useless-path-segments
const APIFeatures = require('./../utils/apiFeatures');
// eslint-disable-next-line import/no-useless-path-segments
const catchAsync = require('./../utils/catchAsync');
//Imported model which contain Tour Model Database Schema
// eslint-disable-next-line import/no-useless-path-segments
const AppError = require('./../utils/appError');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

//Route Handlers
//To get All Tours
exports.getAllTours = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .pagingFields();
  // console.log('Output of features.query --->');
  // console.log(features.query);
  const tours = await features.query;

  res.status(200).json({
    status: 'success',
    data: {
      tours,
    },
  });
  // //1A)Filtering
  // // eslint-disable-next-line node/no-unsupported-features/es-syntax
  // const queryObj = { ...req.query };
  // // console.log(...req.query);
  // const excludeFields = ['page', 'sort', 'limit', 'fields'];
  // excludeFields.forEach((el) => delete queryObj[el]);
  // //1B) Advanced Filtering
  // let queryStr = JSON.stringify(queryObj);
  // // '\b -> used to match exactly same string
  // // '(gte|gt|lte|lt)' -> used to find any one of the them from string
  // // '//g' -> to replace at more than one place
  // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  // // console.log(queryStr);
  // let query = Tour.find(JSON.parse(queryStr));
  // //2) Sorting
  // if (req.query.sort) {
  //   console.log(req.query.sort);
  //   const sortBy = req.query.sort.split(',').join(' ');
  //   query = query.sort(sortBy);
  // } else {
  //   // query = query.sort('-createdAt');
  // }
  //3)Limiting
  // if (req.query.fields) {
  //   const fields = req.query.fields.split(',').join(' ');
  //   query = query.select(fields);
  // } else {
  //   query = query.select('-__v');
  // }
  //4)Pagination
  // const page = req.query.page * 1 || 1;
  // const limit = req.query.limit * 1 || 100;
  // const skip = (page - 1) * limit;
  // query = query.skip(skip).limit(limit);
  // console.log(page, limit, skip);
  // if (req.query.page) {
  //   const numTours = await Tour.countDocuments();
  //   if (skip >= numTours) throw new Error('Page does not exists.');
  // }
  //Execute Query
});

//To get Specific Tour
exports.tour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  if (!tour) {
    return next(new AppError(`Tour does not exists.`, 404));
  }
  res.status(200).json({ status: 'success', data: { tours: tour } });
});

//Create a new Tour
exports.createTour = catchAsync(async (req, res, next) => {
  // const newTour = new Tour({}) ;
  // newTour.save();
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});

//Update information in a Tour
exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.updateMany(
    { _id: req.params.id },
    { name: req.body.name }
  );
  if (!tour) {
    return next(new AppError(`Tour does not exists.`, 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
});
//Delete a Tour
exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour) {
    return next(new AppError(`Tour does not exists.`, 404));
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.aggregate = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    { $match: { ratingsAverage: { $gte: 4.7 } } },
    {
      $group: {
        _id: '$difficulty',
        totalTours: { $sum: 1 },
        price: { $avg: '$price' },
        maxPrice: { $max: '$price' },
        minPrice: { $min: '$price' },
      },
    },
    { $sort: { price: -1 } },
  ]);
  res.status(200).json({
    status: 'success',
    data: stats,
  });
});

exports.monthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const monthData = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numTourStarts: -1, month: 1 },
    },
  ]);
  res.status(200).json({
    status: 'success',
    message: monthData,
  });
});
