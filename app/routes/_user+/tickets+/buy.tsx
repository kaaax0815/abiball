import type { ActionArgs, LoaderArgs, V2_MetaFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { Form, useActionData, useNavigation } from '@remix-run/react';
import invariant from 'tiny-invariant';

import FormError from '~/components/FormError';
import FormInput from '~/components/FormInput';
import FormSubmit from '~/components/FormSubmit';
import { isAuthenticated } from '~/utils/auth.server';
import { db } from '~/utils/db.server';
import { badRequest, getOrigin } from '~/utils/request.server';
import { createStripeSession } from '~/utils/stripe.server';

export const meta: V2_MetaFunction = () => [
  {
    title: 'Kaufen - Abiball'
  }
];

export async function action({ request }: ActionArgs) {
  const { userId } = await isAuthenticated(request, {
    redirectTo: '/tickets/buy',
    checkVerified: true
  });

  const form = await request.formData();

  const firstname = form.get('firstname');
  const lastname = form.get('lastname');

  if (typeof firstname !== 'string' || typeof lastname !== 'string') {
    return badRequest({ message: 'Missing firstname or lastname' });
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { email: true }
  });

  invariant(user, "User doesn't exist");

  const session = await createStripeSession({
    userId,
    firstname,
    lastname,
    origin: getOrigin(request),
    email: user.email
  });

  if (!session.url) {
    return badRequest({ message: 'Konnte keine Stripe Sitzung erstellen' });
  }

  return redirect(session.url);
}

export async function loader({ request }: LoaderArgs) {
  await isAuthenticated(request, {
    redirectTo: '/tickets/buy',
    checkVerified: true
  });
  return null;
}

export default function Buy() {
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();
  const submitting = navigation.state === 'submitting';
  return (
    <main className="flex items-center bg-slate-200">
      <div className="mx-auto flex max-w-sm flex-col items-center justify-center rounded-md border border-gray-200 bg-white p-4 shadow">
        <div className="w-full max-w-md space-y-8">
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Ticket kaufen
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            kaufe ein Ticket für dich <br />
            oder einer anderen Person
          </p>
          <Form method="post">
            <FormInput id="firstname" autoComplete="given-name" label="Vorname" name="firstname" />
            <FormInput id="lastname" autoComplete="family-name" label="Nachname" name="lastname" />
            <FormSubmit label="Kaufen" submitting={submitting} />
            <FormError error={actionData?.message} />
          </Form>
        </div>
      </div>
    </main>
  );
}
