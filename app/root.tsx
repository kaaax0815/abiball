import type { LinksFunction, V2_MetaFunction } from '@remix-run/node';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';

import stylesheet from '~/tailwind.css';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: stylesheet }];

export const meta: V2_MetaFunction = () => {
  return [
    {
      charSet: 'utf-8'
    },
    { title: 'Abiball' },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' }
  ];
};

export default function App() {
  return (
    <html lang="de">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
