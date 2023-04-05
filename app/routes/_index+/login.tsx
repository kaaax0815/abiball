import type { ActionArgs, LoaderArgs, V2_MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, Link, useLoaderData, useNavigation, useSearchParams } from '@remix-run/react';

import FormError from '~/components/FormError';
import FormInput from '~/components/FormInput';
import FormSubmit from '~/components/FormSubmit';
import { authenticator } from '~/services/auth.server';
import { sessionStorage } from '~/services/session.server';
import { parseRedirectToFromForm, parseRedirectToFromRequest } from '~/utils/redirect.server';

export const meta: V2_MetaFunction = () => {
  return [{ title: 'Anmelden - Abiball' }];
};

export async function action({ request }: ActionArgs) {
  const clonedRequest = request.clone();
  const formData = await clonedRequest.formData();
  const redirectTo = parseRedirectToFromForm(formData.get('redirectTo'));
  return authenticator.authenticate('user-pass', request, {
    successRedirect: redirectTo,
    failureRedirect: `/login?redirectTo=${redirectTo}`
  });
}

export async function loader({ request }: LoaderArgs) {
  const redirectTo = parseRedirectToFromRequest(request);
  await authenticator.isAuthenticated(request, {
    successRedirect: redirectTo
  });
  const session = await sessionStorage.getSession(request.headers.get('Cookie'));
  const error = session.get(authenticator.sessionErrorKey);
  if (error?.message) {
    return json({ message: error.message as string });
  }
  return json({ message: null });
}

export default function Login() {
  const [searchParams] = useSearchParams();
  const navigation = useNavigation();
  const loaderData = useLoaderData<typeof loader>();
  const submitting = navigation.state === 'submitting';
  const redirectTo = searchParams.get('redirectTo');
  return (
    <main className="flex items-center bg-slate-200">
      <div className="mx-auto flex max-w-sm flex-col items-center justify-center rounded-md border border-gray-200 bg-white p-4 shadow">
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
            <input type="hidden" name="type" value="login" />
            <FormInput id="email" name="email" label="Email-Adresse" autoComplete="email" />
            <FormInput
              id="password"
              name="password"
              type="password"
              label="Passwort"
              autoComplete="current-password"
            />
            <FormError error={loaderData.message} />
            <FormSubmit label="Anmelden" submitting={submitting} />
          </Form>
        </div>
      </div>
    </main>
  );
}
