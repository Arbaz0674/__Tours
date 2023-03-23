/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe(
  'pk_test_51MnP3pSGkM1isxLM5ZX6ROZ1tDmnk3oioZEyLHWi47ACULhbEIXo8I38aBun8H1N4ong9O8709xAYXrEZ1KLUyhF00k6XkE7Cv'
);

export const bookTour = async (tourId) => {
  try {
    //1) Get Checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    //2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    showAlert('error', err);
  }
};
