import { NavLink } from '@remix-run/react';

import { classNames } from '~/utils/style';

export type DesktopNavigationProps = {
  navigation: { name: string; to: string }[];
};

export default function DesktopNavigation({ navigation }: DesktopNavigationProps) {
  return (
    <div className="hidden sm:ml-6 sm:block">
      <div className="flex space-x-4">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            className={({ isActive }) =>
              classNames(
                'rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white',
                isActive ? 'bg-gray-900 text-white' : ''
              )
            }
          >
            {item.name}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
