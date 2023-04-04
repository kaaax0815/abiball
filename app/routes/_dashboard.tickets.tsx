import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import type { V2_MetaFunction } from '@remix-run/react';
import { Link, useLoaderData } from '@remix-run/react';

import { authenticator } from '~/services/auth.server';
import { db } from '~/utils/db.server';

export const meta: V2_MetaFunction = () => [
  {
    title: 'Tickets - Abiball'
  }
];

export async function loader({ request }: LoaderArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login?redirectTo=/tickets'
  });

  const tickets = await db.ticket.findMany({
    where: {
      userId: user.userId
    }
  });

  return json(tickets);
}

export default function Tickets() {
  const loaderData = useLoaderData<typeof loader>();
  return (
    <main>
      <h2 className="text-xl">Hier kannst du Tickets kaufen oder herunterladen</h2>
      <ul>
        {loaderData.map((ticket) => (
          <li key={ticket.id} className="my-5">
            <Link
              reloadDocument
              to={`/ticket/${ticket.id}.pdf`}
              className="rounded-sm bg-slate-500 p-2"
            >
              {ticket.firstName} {ticket.lastName}
            </Link>
          </li>
        ))}
      </ul>
      <Link to="/ticket/buy" className="mt-5 rounded-md bg-indigo-400 p-3 text-white">
        Ticket kaufen
      </Link>
    </main>
  );
}
