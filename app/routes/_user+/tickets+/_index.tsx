import type { LoaderArgs, V2_MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';

import { isAuthenticated } from '~/utils/auth.server';
import { db } from '~/utils/db.server';
import { DD_MM_YYYY, formatIso } from '~/utils/time';

export const meta: V2_MetaFunction = () => [
  {
    title: 'Tickets - Abiball'
  }
];

export async function loader({ request }: LoaderArgs) {
  const { userId } = await isAuthenticated(request, {
    redirectTo: '/tickets',
    checkVerified: true
  });

  const tickets = await db.ticket.findMany({
    where: {
      ownerId: userId
    }
  });

  return json(tickets);
}

export default function Tickets() {
  const loaderData = useLoaderData<typeof loader>();
  return (
    <main className="flex items-center bg-slate-200">
      <div className="mx-auto flex min-w-[15rem] max-w-sm flex-col items-center justify-center rounded-md border border-gray-200 bg-white p-4 shadow">
        <div className="w-full max-w-md space-y-8">
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Tickets
          </h2>
          {loaderData.length === 0 ? (
            <div className="text-center">
              <span className="text-sm font-medium text-gray-500">
                Du hast noch kein Ticket gekauft
              </span>
            </div>
          ) : (
            <>
              {loaderData.map((ticket) => (
                <div key={ticket.id} className="flex flex-col space-y-2">
                  <div>
                    <span className="font-medium text-gray-900">
                      {ticket.firstname} {ticket.lastname}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">
                      {formatIso(ticket.createdAt, DD_MM_YYYY)}
                    </span>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Link
                      to={`/tickets/${ticket.id}`}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Ansehen
                    </Link>
                    <Link
                      reloadDocument
                      to={`/tickets/${ticket.id}.pdf`}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Ausdrucken
                    </Link>
                  </div>
                </div>
              ))}
            </>
          )}
          <Link
            to="/tickets/buy"
            className="flex w-full items-center justify-center rounded bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            Ticket kaufen
          </Link>
        </div>
      </div>
    </main>
  );
}
