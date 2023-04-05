import Stripe from 'stripe';

const stripeKey = process.env.STRIPE_KEY;
if (!stripeKey) {
  throw new Error('STRIPE_KEY must be set');
}

export const stripe = new Stripe(stripeKey, {
  apiVersion: '2022-11-15'
});
