import type { ActionArgs } from '@remix-run/node';
import { Form, useActionData, useNavigation, useSearchParams } from '@remix-run/react';

import FormError from '~/components/FormError';
import FormInput from '~/components/FormInput';
import FormSubmit from '~/components/FormSubmit';
import { db } from '~/utils/db.server';
import { badRequest, validateRedirectUrl } from '~/utils/request.server';
import { createUserSession, register } from '~/utils/session.server';

function validateFirstname(username: unknown) {
  if (typeof username !== 'string' || username.length < 3) {
    return `Vorname muss mindestens 3 Zeichen lang sein`;
  }
}

function validateLastname(username: unknown) {
  if (typeof username !== 'string' || username.length < 3) {
    return `Nachname muss mindestens 3 Zeichen lang sein`;
  }
}

function validateUsername(username: unknown) {
  if (typeof username !== 'string' || username.length < 3) {
    return `Benutzername muss mindestens 3 Zeichen lang sein`;
  }
}

function validatePassword(password: unknown) {
  if (typeof password !== 'string' || password.length < 8) {
    return `Passwort muss mindestens 8 Zeichen lang sein`;
  }
}

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();
  const firstname = form.get('firstname');
  const lastname = form.get('lastname');
  const username = form.get('username');
  const password = form.get('password');
  const redirectTo = form.get('redirectTo') || '/tickets';
  if (
    typeof firstname !== 'string' ||
    typeof lastname !== 'string' ||
    typeof username !== 'string' ||
    typeof password !== 'string' ||
    typeof redirectTo !== 'string'
  ) {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: `Ungültiges Formular`
    });
  }

  const redirectToUrl = validateRedirectUrl(redirectTo);

  const fields = { firstname, lastname, username, password };

  const fieldErrors = {
    firstname: validateFirstname(firstname),
    lastname: validateLastname(lastname),
    username: validateUsername(username),
    password: validatePassword(password)
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
      formError: null
    });
  }

  const userExists = await db.user.findFirst({
    where: { username }
  });

  if (userExists) {
    return badRequest({
      fieldErrors: null,
      fields,
      formError: `Benutzername bereits vergeben`
    });
  }

  const user = await register({ firstname, lastname, username, password });
  if (!user) {
    return badRequest({
      fieldErrors: null,
      fields,
      formError: `Registrierung fehlgeschlagen`
    });
  }

  return createUserSession(user.id, redirectToUrl);
};

export default function Register() {
  const [searchParams] = useSearchParams();
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();
  const submitting = navigation.state === 'submitting';
  return (
    <div className="flex h-screen items-center bg-slate-200">
      <main className="mx-auto flex max-w-sm flex-col items-center justify-center rounded-md border border-gray-200 bg-white p-4 shadow">
        <div className="w-full max-w-md space-y-8">
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
            Registrieren
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Erstelle ein Konto um deine Tickets zu verwalten
          </p>
          <Form method="post">
            <input
              type="hidden"
              name="redirectTo"
              value={searchParams.get('redirectTo') ?? undefined}
            />
            <FormInput
              id="firstname"
              name="firstname"
              label="Vorname"
              autoComplete="given-name"
              error={actionData?.fieldErrors?.firstname}
              defaultValue={actionData?.fields?.firstname}
            />
            <FormInput
              id="lastname"
              name="lastname"
              label="Nachname"
              autoComplete="family-name"
              error={actionData?.fieldErrors?.lastname}
              defaultValue={actionData?.fields?.lastname}
            />
            <FormInput
              id="username"
              name="username"
              label="Benutzername"
              autoComplete="username"
              error={actionData?.fieldErrors?.username}
              defaultValue={actionData?.fields?.username}
            />
            <FormInput
              id="password"
              name="password"
              type="password"
              label="Passwort"
              autoComplete="new-password"
              error={actionData?.fieldErrors?.password}
            />
            <FormError error={actionData?.formError} />
            <FormSubmit label="Registrieren" submitting={submitting} />
          </Form>
        </div>
      </main>
    </div>
  );
}
