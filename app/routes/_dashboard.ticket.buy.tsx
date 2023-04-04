import type { ActionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { Form } from '@remix-run/react';

import { authenticator } from '~/services/auth.server';
import { createStripeSession } from '~/services/stripe.server';
import { badRequest, getOrigin } from '~/utils/request.server';

export async function action({ request }: ActionArgs) {
  const { userId } = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login?redirectTo=/tickets/buy'
  });

  const form = await request.formData();

  const firstname = form.get('firstname');
  const lastname = form.get('lastname');

  if (typeof firstname !== 'string' || typeof lastname !== 'string') {
    return badRequest({ message: 'Missing firstname or lastname' });
  }

  const session = await createStripeSession({
    userId,
    firstname,
    lastname,
    origin: getOrigin(request)
  });

  if (!session.url) {
    return badRequest({ message: 'Could not create Stripe session' });
  }

  return redirect(session.url);
}

export default function Buy() {
  return (
    <Form method="post">
      <input required type="text" name="firstname" />
      <input required type="text" name="lastname" />
      <button type="submit">Kaufen</button>
    </Form>
  );
}
