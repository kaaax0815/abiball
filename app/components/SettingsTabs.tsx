import { NavLink } from '@remix-run/react';

import { classNames } from '~/utils/style';

const tabs = [
  {
    name: 'Profil',
    to: '/profile'
  },
  {
    name: 'Passwort',
    to: '/password'
  }
];

export default function SettingsTabs() {
  return (
    <header className="w-full bg-slate-300">
      <ul className="mx-auto flex max-w-sm flex-wrap justify-between border-b border-gray-300 text-center text-sm font-medium text-gray-600">
        {tabs.map((tab) => (
          <li className="mr-2" key={tab.to}>
            <NavLink
              to={tab.to}
              className={({ isActive }) =>
                classNames(
                  'inline-block rounded-t-lg p-4 hover:bg-gray-50 hover:text-gray-600',
                  isActive ? 'bg-gray-100 text-blue-600' : ''
                )
              }
            >
              {tab.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </header>
  );
}
