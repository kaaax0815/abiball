// Strongly type Stripe Events
/// <reference types="stripe-event-types" />
import type { Stripe } from 'stripe';

import { db } from './db.server';

export type DiscriminatedEvent = Stripe.DiscriminatedEvent;

export async function handleCheckoutSessionCompleted(event: Stripe.DiscriminatedEvent) {
  if (event.type !== 'checkout.session.completed') {
    return;
  }
  const eventObject = event.data.object as Stripe.Checkout.Session;

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
