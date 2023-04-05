import type { ActionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';

import { loadStripeWebhookSecret, stripe } from '~/services/stripe.server';
import { notFound } from '~/utils/request.server';
import type { DiscriminatedEvent } from '~/utils/stripe.server';
import { handleCheckoutSessionCompleted } from '~/utils/stripe.server';

export async function action({ request }: ActionArgs) {
  const payload = await request.text();
  const sig = request.headers.get('stripe-signature');
  if (!sig) {
    throw json({ errors: [{ message: 'Missing Signature' }] }, 400);
  }
  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      sig,
      loadStripeWebhookSecret()
    ) as DiscriminatedEvent;
    switch (event.type) {
      case 'checkout.session.completed': {
        await handleCheckoutSessionCompleted(event);
        break;
      }
      default:
        throw new Error(`Unhandled event type ${event.type}`);
    }
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      throw json({ errors: [{ message: err.message }] }, 400);
    }
  }
  return new Response(null, { status: 200 });
}

export function loader() {
  return notFound('Not Found');
}
