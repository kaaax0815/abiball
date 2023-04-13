import { Disclosure } from '@headlessui/react';
import { CameraIcon, TicketIcon, UsersIcon } from '@heroicons/react/24/outline';

import DesktopNavigation from './DesktopNavigation';
import MobileNavigation from './MobileNavigation';

export const navigation = [
  { name: 'Benutzer', to: '/admin/users', Icon: UsersIcon },
  { name: 'Tickets', to: '/admin/tickets', Icon: TicketIcon },
  { name: 'Scan', to: '/admin/scan', Icon: CameraIcon }
];

export default function AdminNavbar() {
  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto max-h-16 max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <MobileNavigation.Button open={open} />
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <DesktopNavigation navigation={navigation} />
              </div>
            </div>
          </div>
          <MobileNavigation.Panel navigation={navigation} />
        </>
      )}
    </Disclosure>
  );
}
