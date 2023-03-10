// eslint-disable-next-line import/no-useless-path-segments
const AppError = require('../utils/appError');
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

// /tours-within/:distance/center/:latlng/unit/:unit
// /tours-within/233/center/33.74130827712465,-118.10607715084403/unit/mi

exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  //Convert miles or km to radians(distance / radius of earth )
  // eslint-disable-next-line prefer-const
  let radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(new AppError(`Please provide latitue and longitude`, 400));
  }

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  console.log(distance, lat, lng, unit);

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours,
    },
  });
});

// '/distances/:latlng/unit/:unit'

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please specify latitude and longitude for Finding Nearest Tour',
        400
      )
    );
  }

  const distance = await Tour.aggregate([
    {
      //geoNear should always be the first stage in aggregation pipeline if used for GeoSpatial
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1], //Geo-JSON Object
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      data: distance,
    },
  });
});
