import type { ActionArgs } from '@remix-run/node';
import { Form, useActionData, useNavigation, useSearchParams } from '@remix-run/react';

import { db } from '~/utils/db.server';
import { badRequest, validateRedirectUrl } from '~/utils/request.server';
import { createUserSession, register } from '~/utils/session.server';

function validateName(username: unknown) {
  if (typeof username !== 'string' || username.length < 3) {
    return `Namen müssen mindestens 3 Zeichen lang sein`;
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
    firstname: validateName(firstname),
    lastname: validateName(lastname),
    username: validateName(username),
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
      formError: `Nutzername bereits vergeben`
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
    <main>
      <h1>Registrieren</h1>
      <h3>Hier kannst du dich registrieren</h3>
      <Form method="post">
        <div>
          <input
            type="hidden"
            name="redirectTo"
            value={searchParams.get('redirectTo') ?? undefined}
          />
          <label htmlFor="firstname-input">Vorname</label>
          <input
            type="text"
            id="firstname-input"
            name="firstname"
            defaultValue={actionData?.fields?.firstname}
          />
          {actionData?.fieldErrors?.firstname ? (
            <p className="form-validation-error" role="alert" id="firstname-error">
              {actionData.fieldErrors.firstname}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="lastname-input">Nachname</label>
          <input
            type="text"
            id="lastname-input"
            name="lastname"
            defaultValue={actionData?.fields?.lastname}
          />
          {actionData?.fieldErrors?.lastname ? (
            <p className="form-validation-error" role="alert" id="lastname-error">
              {actionData.fieldErrors.lastname}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="username-input">Benutzername</label>
          <input
            type="text"
            id="username-input"
            name="username"
            defaultValue={actionData?.fields?.username}
          />
          {actionData?.fieldErrors?.username ? (
            <p className="form-validation-error" role="alert" id="username-error">
              {actionData.fieldErrors.username}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="password-input">Passwort</label>
          <input id="password-input" name="password" type="password" />
          {actionData?.fieldErrors?.password ? (
            <p className="form-validation-error" role="alert" id="password-error">
              {actionData.fieldErrors.password}
            </p>
          ) : null}
        </div>
        <div id="form-error-message">
          {actionData?.formError ? <p role="alert">{actionData.formError}</p> : null}
        </div>
        <button type="submit">{submitting ? 'Registrieren...' : 'Registrieren'}</button>
      </Form>
    </main>
  );
}
