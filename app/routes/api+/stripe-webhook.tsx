import type { ActionArgs } from '@remix-run/node';

import { stripe } from '~/services/stripe.server';
import { badRequest, notFound } from '~/utils/request.server';
import type { DiscriminatedEvent } from '~/utils/stripe.server';
import { loadStripeWebhookSecret } from '~/utils/stripe.server';
import { handleCheckoutSessionCompleted } from '~/utils/stripe.server';

export async function action({ request }: ActionArgs) {
  const payload = await request.text();
  const sig = request.headers.get('stripe-signature');
  if (!sig) {
    throw badRequest({ message: 'Missing Signature' });
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
    if (err instanceof Error) {
      throw badRequest({ message: err.message });
    }
  }
  return null;
}

export function loader() {
  return notFound('Not Found');
}
