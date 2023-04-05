import { Link } from '@remix-run/react';

export default function Index() {
  return (
    <main className="flex h-screen flex-col justify-center text-center">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Abiball 2023</h1>
      <h3 className="mt-6 text-lg leading-8 text-gray-600">Abiball Gymnasium Bad Königshofen</h3>
      <div className="mt-10">
        <Link
          to="/tickets"
          role="button"
          className=" rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Ticket kaufen
        </Link>
      </div>
    </main>
  );
}
