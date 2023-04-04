import Stripe from 'stripe';

const stripeKey = process.env.STRIPE_KEY;
if (!stripeKey) {
  throw new Error('STRIPE_KEY must be set');
}

export const stripe = new Stripe(stripeKey, {
  apiVersion: '2022-11-15'
});

export function loadStripeWebhookSecret() {
  const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET;
  if (!stripeWebhookSecret) {
    throw new Error('STRIPE_WEBHOOK_ENDPOINT_SECRET must be set');
  }
  return stripeWebhookSecret;
}

export function loadStripeTicketId() {
  const stripeTicketId = process.env.STRIPE_TICKET_ID;
  if (!stripeTicketId) {
    throw new Error('STRIPE_TICKET_ID must be set');
  }
  return stripeTicketId;
}

export type createStripeSessionArgs = {
  userId: string;
  origin: string;
  firstname: string;
  lastname: string;
};

export async function createStripeSession({
  userId,
  origin,
  firstname,
  lastname
}: createStripeSessionArgs) {
  const lineItems = [
    {
      price: loadStripeTicketId(),
      quantity: 1
    }
  ];

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card', 'giropay', 'sofort'],
    line_items: lineItems,
    success_url: `${origin}/tickets?status=success`,
    cancel_url: `${origin}/tickets?status=canceled`,
    metadata: {
      firstname,
      lastname,
      userId
    }
  });

  return session;
}
