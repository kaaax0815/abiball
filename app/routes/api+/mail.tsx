import type { LoaderArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';

import { db } from '~/utils/db.server';
import { verifyVerifyToken } from '~/utils/mail.server';
import { badRequest } from '~/utils/request.server';

export async function loader({ request }: LoaderArgs) {
  const token = new URL(request.url).searchParams.get('token');

  if (!token) {
    throw badRequest('Missing token');
  }
  const email = verifyVerifyToken(token);

  const user = await db.user.findUnique({ where: { email } });

  if (!user) {
    throw badRequest('Invalid token');
  }

  await db.user.update({
    where: { email },
    data: { verified: true }
  });

  return redirect('/tickets');
}
