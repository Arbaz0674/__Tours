// eslint-disable-next-line import/no-useless-path-segments
const Tour = require('./../models/tourModel');

// eslint-disable-next-line import/no-useless-path-segments
const catchAsync = require('./../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res) => {
  //1) Get Tour Data from collection
  const tours = await Tour.find();

  //2) Build Template

  //3) Render that template using tour data from 1)

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTours = catchAsync(async (req, res) => {
  //1) Get Data for the requested Tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.tourType }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  //2) Build template
  //3)Render Template Using Data from Step1
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});

exports.getloginForm = (req, res, next) => {
  res.status(200).render('login', {
    title: `Login into your account`,
  });
};
