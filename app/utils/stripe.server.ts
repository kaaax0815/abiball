// Strongly type Stripe Events
/// <reference types="stripe-event-types" />
import type { Stripe } from 'stripe';

import { stripe } from '~/services/stripe.server';

import { db } from './db.server';

export type DiscriminatedEvent = Stripe.DiscriminatedEvent;

export async function handleCheckoutSessionCompleted(
  event: Stripe.DiscriminatedEvent.CheckoutSessionEvent
) {
  const eventObject = event.data.object;

  if (eventObject.payment_status !== 'paid') {
    return;
  }

  if (!eventObject.metadata) {
    return;
  }

  const { userId, firstname, lastname } = eventObject.metadata;

  if (userId === undefined || firstname === undefined || lastname === undefined) {
    return;
  }

  const owner = db.user.findUnique({ where: { id: userId } });

  if (!owner) {
    return;
  }

  const ticket = await db.ticket.create({
    data: {
      owner: {
        connect: {
          id: userId
        }
      },
      firstname,
      lastname
    }
  });

  return ticket;
}

export function loadStripeWebhookSecret() {
  const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripeWebhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET must be set');
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
  email: string;
};

export async function createStripeSession({
  userId,
  origin,
  firstname,
  lastname,
  email
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
    },
    customer_email: email
  });

  return session;
}
