import { Link } from '@remix-run/react';

import useDisclosure from '~/hooks/useDisclosure';

export type NavbarProps = {
  username: string;
};

export default function Navbar({ username }: NavbarProps) {
  const { isOpen: isMenuOpen, toggle: toggleMenu } = useDisclosure();
  const { isOpen: isUserOpen, toggle: toggleUser } = useDisclosure();
  return (
    <nav className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
              onClick={() => toggleMenu()}
            >
              <span className="sr-only">Hauptmenü öffnen</span>

              <svg
                className="block h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>

              <svg
                className="hidden h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center">
              <span className="text-blue-500 text-2xl">Abiball</span>
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                <Link
                  to="/tickets"
                  className="bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium"
                  aria-current="page"
                >
                  Tickets
                </Link>
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <div className="relative ml-3">
              <div>
                <button
                  type="button"
                  className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  id="user-menu-button"
                  aria-expanded={isUserOpen}
                  aria-haspopup="true"
                  onClick={() => toggleUser()}
                >
                  <span className="sr-only">Benutzermenü öffnen</span>
                  <span>{username}</span>
                </button>
              </div>

              <div
                className={
                  'absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none' +
                  `${isUserOpen ? ' block' : ' hidden'}`
                }
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu-button"
                tabIndex={-1}
              >
                <a
                  href="/logout"
                  className="block px-4 py-2 text-sm text-gray-700"
                  role="menuitem"
                  tabIndex={-1}
                  id="user-menu-item-2"
                >
                  Abmelden
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={isMenuOpen ? 'block' : 'hidden'} id="mobile-menu">
        <div className="space-y-1 px-2 pb-3 pt-2">
          <Link
            to="/tickets"
            className="bg-gray-900 text-white block rounded-md px-3 py-2 text-base font-medium"
            aria-current="page"
          >
            Tickets
          </Link>
        </div>
      </div>
    </nav>
  );
}
