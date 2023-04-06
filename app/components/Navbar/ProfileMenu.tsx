import { Menu, Transition } from '@headlessui/react';
import { ArrowLeftOnRectangleIcon, UserIcon } from '@heroicons/react/24/outline';
import { Form, Link, NavLink } from '@remix-run/react';
import { Fragment } from 'react';

export type ProfileMenuProps = {
  user: { firstname: string; lastname: string } | null;
};

export default function ProfileMenu({ user }: ProfileMenuProps) {
  return (
    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
      {user === null ? (
        <div className="relative ml-3">
          <Link
            to="/login"
            className="rounded-lg border-2 border-indigo-600 px-3 py-2 text-sm text-white"
          >
            Anmelden
          </Link>
        </div>
      ) : (
        <Menu as="div" className="relative ml-3">
          <div>
            <Menu.Button className="flex rounded-md bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
              <span className="sr-only">Benutzermenü öffnen</span>
              <span className="px-3 py-2 text-white">
                {user.firstname} {user.lastname}
              </span>
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
              <Menu.Item>
                {({ active }) => (
                  <NavLink
                    to="/profile"
                    className={
                      'block w-full text-left px-2 py-2 text-sm text-gray-700 aria-active:bg-gray-200' +
                      `${active ? ' bg-gray-100' : ''}`
                    }
                  >
                    <span>
                      <UserIcon className="inline-block h-6 w-6" /> Profil
                    </span>
                  </NavLink>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <Form action="/logout" method="post">
                    <button
                      type="submit"
                      className={
                        'block w-full text-left px-2 py-2 text-sm text-gray-700' +
                        `${active ? ' bg-gray-100' : ''}`
                      }
                    >
                      <span>
                        <ArrowLeftOnRectangleIcon className="inline-block h-6 w-6" /> Abmelden
                      </span>
                    </button>
                  </Form>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      )}
    </div>
  );
}
