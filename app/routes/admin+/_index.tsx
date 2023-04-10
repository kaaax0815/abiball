import { Link } from '@remix-run/react';

export default function Admin() {
  return (
    <main>
      <h1>Admin</h1>
      <p>Hier kannst du alles verwalten</p>
      <Link to="/admin/scan">KAC scannen</Link>
    </main>
  );
}
