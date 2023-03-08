// eslint-disable-next-line import/no-useless-path-segments
const Tour = require('./../models/tourModel');
// eslint-disable-next-line import/no-useless-path-segments
const catchAsync = require('./../utils/catchAsync');
//Imported model which contain Tour Model Database Schema
// eslint-disable-next-line import/no-useless-path-segments
// const AppError = require('./../utils/appError');

const factory = require('./factoryhandler');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

//Route Handlers
//To get All Tours
exports.getAllTours = factory.getAll(Tour);

//To get Specific Tour
exports.tour = factory.getOne(Tour, 'reviews', { path: 'reviews' }); //path tells which field to populate

//Create a new Tour
exports.createTour = factory.createOne(Tour);

//Update information in a Tour
exports.updateTour = factory.updateOne(Tour);

exports.deleteTour = factory.deleteOne(Tour);
//Delete a Tour
// exports.deleteTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndDelete(req.params.id);
//   if (!tour) {
//     return next(new AppError(`Tour does not exists.`, 404));
//   }
//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// });

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
