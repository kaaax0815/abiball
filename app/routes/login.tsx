import type { ActionArgs } from '@remix-run/node';
import { Form, useActionData, useNavigation, useSearchParams } from '@remix-run/react';

import { badRequest } from '~/utils/request.server';

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

function validateUrl(url: string) {
  let urls = ['/tickets', '/'];
  if (urls.includes(url)) {
    return url;
  }
  return '/tickets';
}

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();
  const username = form.get('username');
  const password = form.get('password');
  const redirectTo = form.get('redirectTo') || '/tickets';
  if (
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
  const redirectToUrl = validateUrl(redirectTo);

  const fields = { username, password };
  const fieldErrors = {
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

  return badRequest({
    fieldErrors: null,
    fields,
    formError: 'Not implemented'
  });
};

export default function Login() {
  const [searchParams] = useSearchParams();
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();
  const submitting = navigation.state === 'submitting';
  return (
    <main>
      <h1>Anmelden</h1>
      <h2>Hier kannst du dich anmelden</h2>
      <Form method="post">
        <div>
          <input
            type="hidden"
            name="redirectTo"
            value={searchParams.get('redirectTo') ?? undefined}
          />
          <label htmlFor="username-input">Benutzername</label>
          <input
            type="text"
            id="username-input"
            name="username"
            defaultValue={actionData?.fields?.username}
          />
          {actionData?.fieldErrors?.username ? (
            <p role="alert" id="username-error">
              {actionData.fieldErrors.username}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="password-input">Passwort</label>
          <input id="password-input" name="password" type="password" />
          {actionData?.fieldErrors?.password ? (
            <p role="alert" id="password-error">
              {actionData.fieldErrors.password}
            </p>
          ) : null}
        </div>
        <div id="form-error-message">
          {actionData?.formError ? <p role="alert">{actionData.formError}</p> : null}
        </div>
        <button type="submit">{submitting ? 'Anmelden...' : 'Anmelden'}</button>
      </Form>
    </main>
  );
}
