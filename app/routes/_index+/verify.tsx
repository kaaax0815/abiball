import type { ActionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { Form, useNavigation } from '@remix-run/react';
import invariant from 'tiny-invariant';

import FormSubmit from '~/components/FormSubmit';
import { authenticator } from '~/services/auth.server';
import { db, isVerified } from '~/utils/db.server';
import { sendMail } from '~/utils/mail.server';

export async function action({ request }: ActionArgs) {
  const { userId } = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login?redirectTo=/verify'
  });

  const verified = await isVerified(userId);
  if (verified) {
    return redirect('/tickets');
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { email: true }
  });

  invariant(user, "User doesn't exist");

  await sendMail(request, 'verify', user.email);

  return null;
}

export default function Verify() {
  const navigation = useNavigation();
  const submitting = navigation.state === 'submitting';
  return (
    <main className="flex items-center bg-slate-200">
      <div className="mx-auto flex max-w-sm flex-col items-center justify-center rounded-md border border-gray-200 bg-white p-4 shadow">
        <div className="w-full max-w-md space-y-8">
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Email-Adresse verifizieren
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Du musst deine Email-Adresse verifizieren um Abiball nutzen zu können
          </p>
          <p className="mt-2 text-center text-sm text-gray-600">
            Wir schicken dir eine Email mit einem Link
          </p>
          <Form method="post">
            <FormSubmit label="Email schicken" submitting={submitting} />
          </Form>
        </div>
      </div>
    </main>
  );
}
