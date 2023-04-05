import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';

import Navbar from '~/components/Navbar';
import { authenticator } from '~/services/auth.server';
import { db } from '~/utils/db.server';

export async function loader({ request }: LoaderArgs) {
  const { userId } = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login?redirectTo=/tickets'
  });

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { firstname: true, lastname: true }
  });

  invariant(user, "User doesn't exist");

  return json(user);
}

export default function Dashboard() {
  const loaderData = useLoaderData<typeof loader>();
  return (
    <>
      <Navbar menuTitle={`${loaderData.firstname} ${loaderData.lastname}`} />
      <Outlet />
    </>
  );
}
