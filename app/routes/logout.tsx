import type { ActionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';

import { authenticator } from '~/services/auth.server';

export function action({ request }: ActionArgs) {
  return authenticator.logout(request, { redirectTo: '/login' });
}

export function loader() {
  return redirect('/');
}
