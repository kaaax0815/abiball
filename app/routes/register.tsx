import type { ActionArgs, LoaderArgs, V2_MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, useLoaderData, useNavigation, useSearchParams } from '@remix-run/react';

import FormError from '~/components/FormError';
import FormInput from '~/components/FormInput';
import FormSubmit from '~/components/FormSubmit';
import { authenticator } from '~/services/auth.server';
import { sessionStorage } from '~/services/session.server';
import { parseRedirectToFromForm, parseRedirectToFromRequest } from '~/utils/redirect.server';

export const meta: V2_MetaFunction = () => {
  return [{ title: 'Registrieren - Abiball' }];
};

export async function action({ request }: ActionArgs) {
  const clonedRequest = request.clone();
  const formData = await clonedRequest.formData();
  const redirectTo = parseRedirectToFromForm(formData.get('redirectTo'));
  return authenticator.authenticate('user-pass', request, {
    successRedirect: redirectTo,
    failureRedirect: `/register?redirectTo=${redirectTo}`
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

export default function Register() {
  const [searchParams] = useSearchParams();
  const navigation = useNavigation();
  const loaderData = useLoaderData<typeof loader>();
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
            <input type="hidden" name="type" value="register" />
            <FormInput id="firstname" name="firstname" label="Vorname" autoComplete="given-name" />
            <FormInput id="lastname" name="lastname" label="Nachname" autoComplete="family-name" />
            <FormInput id="username" name="username" label="Benutzername" autoComplete="username" />
            <FormInput
              id="password"
              name="password"
              type="password"
              label="Passwort"
              autoComplete="new-password"
            />
            <FormError error={loaderData.message} />
            <FormSubmit label="Registrieren" submitting={submitting} />
          </Form>
        </div>
      </main>
    </div>
  );
}
