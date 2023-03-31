import { Link } from '@remix-run/react';

export default function Index() {
  return (
    <main>
      <h1>Abiball 2023</h1>
      <h2>Abiball Gymnasium Bad Königshofen</h2>
      <p>Hier kannst du Karten für den Ball kaufen</p>
      <Link to="/tickets">Tickets</Link>
    </main>
  );
}
