import { ArrowRightCircleIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import type { LoaderArgs, V2_MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';

import { isAuthenticated } from '~/utils/auth.server';
import { db } from '~/utils/db.server';

export const meta: V2_MetaFunction = () => {
  return [{ title: 'Benutzer - Admin - Abiball' }];
};

export async function loader({ request }: LoaderArgs) {
  await isAuthenticated(request, {
    redirectTo: '/admin/users',
    checkVerified: true,
    checkAdmin: true
  });

  const params = new URL(request.url).searchParams;

  const filterActive = [...params.keys()].length !== 0;

  const users = await db.user.findMany({
    where: {
      id: params.get('id') ?? undefined
    },
    select: {
      id: true,
      firstname: true,
      lastname: true,
      email: true,
      verified: true,
      admin: true
    }
  });

  return json({ users, filterActive });
}

export default function Users() {
  const loaderData = useLoaderData<typeof loader>();
  return (
    <main>
      {loaderData.filterActive && (
        <Link to="/admin/tickets" className="text-sm text-red-500">
          Achtung: Filter aktiv! Klinke hier um ihn zu entfernen.
        </Link>
      )}
      <table className="w-full table-auto border-collapse text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase text-gray-700">
          <tr>
            <th className="border border-slate-600 px-6 py-3">Aktion</th>
            <th className="border border-slate-600 px-6 py-3">E-Mail</th>
            <th className="border border-slate-600 px-6 py-3">Vorname</th>
            <th className="border border-slate-600 px-6 py-3">Nachname</th>
            <th className="border border-slate-600 px-6 py-3">Verifiziert</th>
            <th className="border border-slate-600 px-6 py-3">Admin</th>
            <th className="border border-slate-600 px-6 py-3">Tickets</th>
          </tr>
        </thead>
        <tbody>
          {loaderData.users.map((user) => (
            <tr key={user.id}>
              <td className="border border-slate-700 px-6 py-4">
                <PencilSquareIcon className="h-6 w-6" />
              </td>
              <td className="border border-slate-700 px-6 py-4">{user.email}</td>
              <td className="border border-slate-700 px-6 py-4">{user.firstname}</td>
              <td className="border border-slate-700 px-6 py-4">{user.lastname}</td>
              <td className="border border-slate-700 px-6 py-4">{user.verified ? 'Ja' : 'Nein'}</td>
              <td className="border border-slate-700 px-6 py-4">{user.admin ? 'Ja' : 'Nein'}</td>
              <td className="border border-slate-700 px-6 py-4">
                <Link to={`/admin/tickets?ownerId=${user.id}`}>
                  <ArrowRightCircleIcon className="h-6 w-6" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
