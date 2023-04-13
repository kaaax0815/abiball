import type { LoaderArgs } from '@remix-run/node';
import { Link } from '@remix-run/react';

import { navigation } from '~/components/Navbar/AdminNavbar';
import { isAuthenticated } from '~/utils/auth.server';

export async function loader({ request }: LoaderArgs) {
  await isAuthenticated(request, {
    redirectTo: '/admin',
    checkVerified: true,
    checkAdmin: true
  });

  return null;
}

export default function Admin() {
  return (
    <main className="flex items-center bg-slate-200">
      <div className="mx-auto flex max-w-sm flex-col items-center justify-center rounded-md border border-gray-200 bg-white p-4 shadow">
        <div className="w-full max-w-md space-y-8">
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Admin
          </h2>
          <div className="flex flex-col space-y-8">
            {navigation.map(({ to, name, Icon }) => (
              <Link to={to} className="font-medium text-indigo-600 hover:text-indigo-500" key={to}>
                <Icon className="inline-block h-6 w-6" /> {name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
