import { ArrowLeftCircleIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import type { LoaderArgs, V2_MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';

import { isAuthenticated } from '~/utils/auth.server';
import { db } from '~/utils/db.server';

export const meta: V2_MetaFunction = () => {
  return [{ title: 'Tickets - Admin - Abiball' }];
};

export async function loader({ request }: LoaderArgs) {
  await isAuthenticated(request, {
    redirectTo: '/admin/tickets',
    checkVerified: true,
    checkAdmin: true
  });

  const params = new URL(request.url).searchParams;

  const filterActive = [...params.keys()].length !== 0;

  const tickets = await db.ticket.findMany({
    where: {
      ownerId: params.get('ownerId') ?? undefined
    },
    select: {
      id: true,
      firstname: true,
      lastname: true,
      owner: {
        select: {
          id: true,
          firstname: true,
          lastname: true
        }
      }
    }
  });

  return json({ tickets, filterActive });
}

export default function Tickets() {
  const loaderData = useLoaderData<typeof loader>();
  return (
    <main>
      {loaderData.filterActive && (
        <Link to="/admin/tickets" className="text-sm text-red-500">
          Achtung: Filter aktiv! Klinke hier um ihn zu entfernen.
        </Link>
      )}
      <table className="w-full table-auto border-collapse text-left text-sm ">
        <thead className="bg-gray-50 text-xs uppercase text-gray-700">
          <tr>
            <th className="border border-slate-600 px-6 py-3">Aktion</th>
            <th className="border border-slate-600 px-6 py-3">Vorname</th>
            <th className="border border-slate-600 px-6 py-3">Nachname</th>
            <th className="border border-slate-600 px-6 py-3">Eigentümer</th>
          </tr>
        </thead>
        <tbody>
          {loaderData.tickets.map((ticket) => (
            <tr key={ticket.id}>
              <td className="border border-slate-700 px-6 py-4">
                <PencilSquareIcon className="h-6 w-6" />
              </td>
              <td className="border border-slate-700 px-6 py-4">{ticket.firstname}</td>
              <td className="border border-slate-700 px-6 py-4">{ticket.lastname}</td>
              <td className="border border-slate-700 px-6 py-4">
                <Link to={`/admin/users?id=${ticket.owner.id}`}>
                  <ArrowLeftCircleIcon className="h-6 w-6" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
