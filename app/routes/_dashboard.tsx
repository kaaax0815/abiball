import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';

import Navbar from '~/components/Navbar';
import { db } from '~/utils/db.server';
import { requireLogin } from '~/utils/request.server';
import { requireUserId } from '~/utils/session.server';

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await requireUserId(request, '/tickets');
  const user = await db.user.findUnique({ where: { id: userId }, select: { username: true } });
  if (user == null) {
    throw requireLogin('/tickets');
  }

  return json(user);
};

export default function Dashboard() {
  const loaderData = useLoaderData<typeof loader>();
  return (
    <>
      <Navbar username={loaderData.username} />
      <Outlet />
    </>
  );
}
