import { Outlet } from '@remix-run/react';

import AdminNavbar from '~/components/Navbar/AdminNavbar';

export default function AdminLayout() {
  return (
    <>
      <AdminNavbar />
      <Outlet />
    </>
  );
}
