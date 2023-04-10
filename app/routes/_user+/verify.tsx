import { InboxArrowDownIcon } from '@heroicons/react/24/outline';
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { Form, useNavigation } from '@remix-run/react';
import invariant from 'tiny-invariant';

import FormSubmit from '~/components/FormSubmit';
import { authenticator } from '~/services/auth.server';
import { invalidateSession } from '~/utils/auth.server';
import { db, isVerified } from '~/utils/db.server';
import { sendMail } from '~/utils/mail.server';

export const meta: V2_MetaFunction = () => {
  return [{ title: 'Verifizieren - Abiball' }];
};

export async function action({ request }: ActionArgs) {
  const { userId } = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login?redirectTo=/verify'
  });

  const verified = await isVerified(userId);
  if (verified) {
    return redirect('/tickets');
  } else if (verified === null) {
    throw await invalidateSession(request);
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { email: true, firstname: true, lastname: true }
  });

  invariant(user, "User doesn't exist");

  await sendMail(request, 'verify', {
    address: user.email,
    name: `${user.firstname} ${user.lastname}`
  });

  return null;
}

export async function loader({ request }: LoaderArgs) {
  const { userId } = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login?redirectTo=/verify'
  });

  const verified = await isVerified(userId);

  if (verified) {
    throw redirect('/tickets');
  } else if (verified === null) {
    throw await invalidateSession(request);
  }
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
            <FormSubmit label="Email schicken" submitting={submitting} Icon={InboxArrowDownIcon} />
          </Form>
        </div>
      </div>
    </main>
  );
}
