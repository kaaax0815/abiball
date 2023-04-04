import type { ActionArgs } from '@remix-run/node';
import { Form, Link, useActionData, useNavigation, useSearchParams } from '@remix-run/react';

import FormError from '~/components/FormError';
import FormInput from '~/components/FormInput';
import FormSubmit from '~/components/FormSubmit';
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
  const redirectTo = searchParams.get('redirectTo');
  return (
    <div className="flex h-screen items-center bg-slate-200">
      <main className="mx-auto flex max-w-sm flex-col items-center justify-center rounded-md border border-gray-200 bg-white p-4 shadow">
        <div className="w-full max-w-md space-y-8">
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Anmelden
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            oder{' '}
            <Link
              to={
                redirectTo ? `/register?redirectTo=${searchParams.get('redirectTo')}` : '/register'
              }
              prefetch="intent"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              registrieren
            </Link>
          </p>
          <Form method="post">
            <input type="hidden" name="redirectTo" value={redirectTo ?? undefined} />
            <FormInput
              id="username"
              name="username"
              label="Benutzername"
              autoComplete="username"
              error={undefined}
              defaultValue={actionData?.fields?.username}
            />
            <FormInput
              id="password"
              name="password"
              type="password"
              label="Passwort"
              autoComplete="current-password"
              error={undefined}
            />
            <FormError error={actionData?.formError} />
            <FormSubmit label="Anmelden" submitting={submitting} />
          </Form>
        </div>
      </main>
    </div>
  );
}
