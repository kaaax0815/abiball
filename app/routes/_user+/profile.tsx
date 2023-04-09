import { PencilSquareIcon } from '@heroicons/react/24/outline';
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, useActionData, useLoaderData, useNavigation } from '@remix-run/react';
import invariant from 'tiny-invariant';

import FormError from '~/components/FormError';
import FormInput from '~/components/FormInput';
import FormSubmit from '~/components/FormSubmit';
import { authenticator } from '~/services/auth.server';
import { db } from '~/utils/db.server';
import { badRequest } from '~/utils/request.server';
import { validateLastname } from '~/utils/validation.server';
import { validateFirstname } from '~/utils/validation.server';

export const meta: V2_MetaFunction = () => {
  return [{ title: 'Profil - Abiball' }];
};

export async function action({ request }: ActionArgs) {
  const clonedRequest = request.clone();

  const { userId } = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login?redirectTo=/profile'
  });

  const form = await clonedRequest.formData();
  const firstname = form.get('firstname');
  const lastname = form.get('lastname');

  try {
    invariant(typeof firstname === 'string', 'Ungültiges Formular');
    invariant(typeof lastname === 'string', 'Ungültiges Formular');

    validateFirstname(firstname);
    validateLastname(lastname);

    await db.user.update({
      where: { id: userId },
      data: {
        firstname,
        lastname
      }
    });

    return json(null);
  } catch (e) {
    if (e instanceof Error) {
      return badRequest({ message: e.message });
    }
    return badRequest({ message: 'Irgendetwas ist schiefgelaufen' });
  }
}

export async function loader({ request }: LoaderArgs) {
  const { userId } = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login?redirectTo=/profile'
  });

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { firstname: true, lastname: true }
  });

  invariant(user, 'User not found');

  return user;
}

export default function Profile() {
  const navigation = useNavigation();
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const submitting = navigation.state === 'submitting';
  return (
    <main className="flex items-center bg-slate-200">
      <div className="mx-auto flex max-w-sm flex-col items-center justify-center rounded-md border border-gray-200 bg-white p-4 shadow">
        <div className="w-full max-w-md space-y-8">
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Profil
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Hier kannst du dein Profil bearbeiten
          </p>
          <Form method="post">
            <FormInput
              id="firstname"
              name="firstname"
              label="Vorname"
              autoComplete="given-name"
              defaultValue={loaderData.firstname}
            />
            <FormInput
              id="lastname"
              name="lastname"
              label="Nachname"
              autoComplete="family-name"
              defaultValue={loaderData.lastname}
            />
            <FormError error={actionData?.message} />
            <FormSubmit label="Speichern" submitting={submitting} Icon={PencilSquareIcon} />
          </Form>
        </div>
      </div>
    </main>
  );
}
