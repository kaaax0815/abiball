import { InboxArrowDownIcon } from '@heroicons/react/24/outline';
import type { ActionArgs } from '@remix-run/node';
import { Form, useActionData, useNavigation } from '@remix-run/react';

import FormInput from '~/components/FormInput';
import { ActionFormResponse } from '~/components/FormResponse';
import FormSubmit from '~/components/FormSubmit';
import { db } from '~/utils/db.server';
import { sendMail } from '~/utils/mail.server';
import { badRequest, success } from '~/utils/request.server';
import { validate, validateEmail } from '~/utils/validation.server';

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const email = formData.get('email');

  try {
    validate(typeof email === 'string', 'Ungültiges Formular');
    validateEmail(email);
  } catch (e) {
    if (e instanceof Error) {
      return badRequest({ message: e.message });
    }
    return badRequest({ message: 'Irgendetwas ist schiefgelaufen' });
  }

  const user = await db.user.findUnique({
    where: { email: email },
    select: { email: true, firstname: true, lastname: true }
  });

  if (!user) {
    return success({
      message: 'Wir haben dir eine Email geschickt wenn die Email-Adresse gültig ist'
    });
  }

  await sendMail(request, 'reset-password', {
    address: user.email,
    name: `${user.firstname} ${user.lastname}`
  });

  return success({
    message: 'Wir haben dir eine Email geschickt wenn die Email-Adresse gültig ist'
  });
}

export default function Forgot() {
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();
  const submitting = navigation.state === 'submitting';
  return (
    <main className="flex items-center bg-slate-200">
      <div className="mx-auto flex max-w-sm flex-col items-center justify-center rounded-md border border-gray-200 bg-white p-4 shadow">
        <div className="w-full max-w-md space-y-8">
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Passwort vergessen?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Wir schicken dir eine Email mit einem Link um ein neues Passwort zu setzen
          </p>
          <Form method="post">
            <FormInput
              id="email"
              name="email"
              label="Email-Adresse"
              type="email"
              autoComplete="email"
            />
            <ActionFormResponse actionData={actionData} />
            <FormSubmit label="Email schicken" submitting={submitting} Icon={InboxArrowDownIcon} />
          </Form>
        </div>
      </div>
    </main>
  );
}
