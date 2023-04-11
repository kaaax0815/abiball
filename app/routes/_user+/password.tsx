import { PencilSquareIcon } from '@heroicons/react/24/outline';
import type { ActionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, useActionData, useNavigation } from '@remix-run/react';
import bcrypt from 'bcryptjs';
import invariant from 'tiny-invariant';

import FormInput from '~/components/FormInput';
import FormResponse from '~/components/FormResponse';
import FormSubmit from '~/components/FormSubmit';
import SettingsTabs from '~/components/SettingsTabs';
import { invalidateSession, isAuthenticated } from '~/utils/auth.server';
import { db } from '~/utils/db.server';
import { badRequest } from '~/utils/request.server';
import { validatePassword } from '~/utils/validation.server';

export async function action({ request }: ActionArgs) {
  const clonedRequest = request.clone();
  const { userId } = await isAuthenticated(request, {
    redirectTo: '/password',
    checkVerified: true
  });
  const formData = await clonedRequest.formData();
  const currentPassword = formData.get('current-password');
  const newPassword = formData.get('new-password');

  try {
    invariant(typeof currentPassword === 'string', 'Ungültiges Formular');
    invariant(typeof newPassword === 'string', 'Ungültiges Formular');

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { passwordHash: true }
    });

    if (!user) {
      throw await invalidateSession(request);
    }

    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.passwordHash);

    invariant(isPasswordCorrect, 'Altes Passwort ist falsch');

    validatePassword(newPassword);

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await db.user.update({
      where: { id: userId },
      data: { passwordHash }
    });

    return json(null);
  } catch (e) {
    if (e instanceof Error) {
      return badRequest({ message: e.message });
    }
    return badRequest({ message: 'Irgendetwas ist schiefgelaufen' });
  }
}

export default function Settings() {
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();
  const submitting = navigation.state === 'submitting';
  return (
    <main className="flex flex-col items-center bg-slate-200">
      <SettingsTabs />
      <div className="m-auto flex max-w-sm flex-col items-center justify-center rounded-md border border-gray-200 bg-white p-4 shadow">
        <div className="w-full max-w-md space-y-8">
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Passwort
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Hier kannst du dein Passwort ändern
          </p>
          <Form method="post">
            <FormInput
              id="current-password"
              type="password"
              name="current-password"
              label="Altes Passwort"
              autoComplete="current-password"
            />
            <FormInput
              id="new-password"
              type="password"
              name="new-password"
              label="Neues Passwort"
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
