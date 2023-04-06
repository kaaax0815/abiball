import type { LinksFunction, LoaderArgs, V2_MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import {
  isRouteErrorResponse,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError
} from '@remix-run/react';

import stylesheet from '~/tailwind.css';

import Navbar from './components/Navbar';
import { authenticator } from './services/auth.server';
import { db } from './utils/db.server';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: stylesheet }];

export const meta: V2_MetaFunction = () => {
  return [{ title: 'Abiball' }];
};

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

export default function App() {
  const loaderData = useLoaderData<typeof loader>();
  return (
    <html lang="de">
      <head>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta charSet="utf-8" />
        <meta name="description" content="Ticket Management System für unseren Abiball" />
        <meta name="theme-color" content="#1f2937" />
        <Meta />
        <Links />
      </head>
      <body>
        <Navbar user={loaderData} />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Uh oh ...</h1>
        <p>Irgendetwas ist schiefgelaufen.</p>
        <pre>{error.message}</pre>
      </div>
    );
  } else {
    return <h1>500 Internal Server Error</h1>;
  }
}
