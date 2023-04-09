import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';

import Navbar from '~/components/Navbar';
import { authenticator } from '~/services/auth.server';
import { db } from '~/utils/db.server';

export async function loader({ request }: LoaderArgs) {
  const userData = await authenticator.isAuthenticated(request);

  if (!userData) {
    return json(null);
  }

  const user = await db.user.findUnique({
    where: { id: userData.userId },
    select: { firstname: true, lastname: true }
  });

  return json(user);
}

export default function UserLayout() {
  const loaderData = useLoaderData<typeof loader>();
  return (
    <>
      <Navbar user={loaderData} />
      <Outlet />
    </>
  );
}
