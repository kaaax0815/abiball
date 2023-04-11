import { PencilSquareIcon } from '@heroicons/react/24/outline';
import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { Form, useActionData, useNavigation } from '@remix-run/react';
import bcrypt from 'bcryptjs';

import FormInput from '~/components/FormInput';
import FormResponse from '~/components/FormResponse';
import FormSubmit from '~/components/FormSubmit';
import { db } from '~/utils/db.server';
import { verifyResetToken } from '~/utils/mail.server';
import { badRequest } from '~/utils/request.server';
import {validate, validatePassword } from '~/utils/validation.server';

export async function action({ request }: ActionArgs) {
  const token = new URL(request.url).searchParams.get('token');

  if (!token) {
    throw badRequest('Fehlender Token');
  }

  const formData = await request.formData();
  const password = formData.get('password');

  try {
    validate(typeof password === 'string', 'Ungültiges Formular');

    validatePassword(password);

    const email = verifyResetToken(token);

    await db.user.update({
      where: { email },
      data: {
        passwordHash: await bcrypt.hash(password, 10)
      }
    });

    return redirect('/login');
  } catch (e) {
    if (e instanceof Error) {
      return badRequest({ message: e.message });
    }
    return badRequest({ message: 'Irgendetwas ist schiefgelaufen' });
  }
}

export async function loader({ request }: LoaderArgs) {
  const token = new URL(request.url).searchParams.get('token');

  if (!token) {
    throw redirect('/');
  }

  return null;
}

export default function Password() {
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();
  const submitting = navigation.state === 'submitting';
  return (
    <main className="flex items-center bg-slate-200">
      <div className="mx-auto flex max-w-sm flex-col items-center justify-center rounded-md border border-gray-200 bg-white p-4 shadow">
        <div className="w-full max-w-md space-y-8">
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Neues Passwort
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Setze ein neues Passwort wenn du deines vergessen hast
          </p>
          <Form method="post">
            <FormInput
              id="password"
              name="password"
              label="Passwort"
              type="password"
              autoComplete="new-password"
            />
            <FormResponse response={actionData?.message} type="error" />
            <FormSubmit label="Speichern" submitting={submitting} Icon={PencilSquareIcon} />
          </Form>
        </div>
      </div>
    </main>
  );
}
