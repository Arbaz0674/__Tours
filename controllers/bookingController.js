// eslint-disable-next-line import/no-extraneous-dependencies
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// eslint-disable-next-line import/no-useless-path-segments
const Tour = require('./../models/tourModel');

// eslint-disable-next-line import/no-useless-path-segments
const Booking = require('./../models/bookingModel');

// eslint-disable-next-line import/no-useless-path-segments
const catchAsync = require('./../utils/catchAsync');

const factory = require('./factoryhandler');

// eslint-disable-next-line import/no-useless-path-segments
const AppError = require('./../utils/appError');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  //1) Get the currently booked tour
  const tour = await Tour.findById(req.params.tourID);
  //2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    //Information about session
    mode: 'payment',
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/?tour=${
      req.params.tourID
    }&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourID,
    //Information about Product that will be purchased
    line_items: [
      {
        price_data: {
          currency: 'inr',
          unit_amount: tour.price * 100,
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
          },
        },
        quantity: 1,
      },
    ],
  });

  //3)Create session as response
  res.status(200).json({
    status: 'success',
    session,
  });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  const { tour, user, price } = req.query;

  console.log(tour, user, price);

  if (!tour && !user && !price) {
    return next();
  }
  await Booking.create({ tour, user, price });

  res.redirect(req.originalUrl.split('?')[0]);
});

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
