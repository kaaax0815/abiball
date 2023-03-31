import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { requireLogin } from '~/utils/request.server';
import { getUser } from '~/utils/session.server';

export const loader = async ({ request }: LoaderArgs) => {
  const user = await getUser(request);

  if (user === null) {
    throw requireLogin('/tickets');
  }

  const tickets = user.tickets;

  return json(tickets);
};

export default function Tickets() {
  const loaderData = useLoaderData<typeof loader>();
  return (
    <>
      <h1>Tickets</h1>
      <h2>Hier kannst du Tickets kaufen oder herunterladen</h2>
      <ul>
        {loaderData.map((ticket) => (
          <li key={ticket.id}>
            <a href={`/tickets/${ticket.id}`}>
              {ticket.firstName} {ticket.lastName}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}
