import type { ActionArgs } from '@remix-run/node';
import { Form, Link, useActionData, useNavigation, useSearchParams } from '@remix-run/react';

import { badRequest, validateRedirectUrl } from '~/utils/request.server';
import { createUserSession, login } from '~/utils/session.server';

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
  const redirectToUrl = validateRedirectUrl(redirectTo);

  const fields = { username, password };

  const user = await login({ username, password });

  if (!user) {
    return badRequest({
      fieldErrors: null,
      fields,
      formError: `Benutzername oder Passwort falsch`
    });
  }

  return createUserSession(user.id, redirectToUrl);
};

export default function Login() {
  const [searchParams] = useSearchParams();
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();
  const submitting = navigation.state === 'submitting';
  return (
    <main>
      <h1 className="text-lg text-blue-600 hover:underline">Anmelden</h1>
      <h3>Hier kannst du dich anmelden</h3>
      <p>
        Noch kein Konto? Hier{' '}
        <Link to={`/register?redirectTo=${searchParams.get('redirectTo')}`} prefetch="intent">
          registrieren
        </Link>
      </p>
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
        </div>
        <div>
          <label htmlFor="password-input">Passwort</label>
          <input id="password-input" name="password" type="password" />
        </div>
        <div id="form-error-message">
          {actionData?.formError ? <p role="alert">{actionData.formError}</p> : null}
        </div>
        <button type="submit">{submitting ? 'Anmelden...' : 'Anmelden'}</button>
      </Form>
    </main>
  );
}
