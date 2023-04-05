import { Disclosure } from '@headlessui/react';

import DesktopNavigation from './DesktopNavigation';
import Logo from './Logo';
import MobileNavigation from './MobileNavigation';
import ProfileMenu from './ProfileMenu';

export type NavbarProps = {
  user: { firstname: string; lastname: string } | null;
};

const navigation = [{ name: 'Tickets', to: '/tickets' }];

export default function Navbar({ user }: NavbarProps) {
  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <MobileNavigation.Button open={open} />
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <Logo />
                <DesktopNavigation navigation={navigation} />
              </div>
              <ProfileMenu user={user} />
            </div>
          </div>
          <MobileNavigation.Panel navigation={navigation} />
        </>
      )}
    </Disclosure>
  );
}
