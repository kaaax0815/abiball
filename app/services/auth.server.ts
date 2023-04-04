import { Authenticator, AuthorizationError } from 'remix-auth';
import { FormStrategy } from 'remix-auth-form';

import { sessionStorage } from '~/services/session.server';
import { login, register } from '~/utils/auth.server';

export type AuthData = {
  userId: string;
};

export const authenticator = new Authenticator<AuthData>(sessionStorage);

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const type = form.get('type');
    switch (type) {
      case 'login': {
        const username = form.get('username');
        const password = form.get('password');

        if (typeof username !== 'string' || typeof password !== 'string') {
          throw new AuthorizationError('Ungültiges Formular');
        }

        const user = await login(username, password);
        return user;
      }
      case 'register': {
        const firstname = form.get('firstname');
        const lastname = form.get('lastname');
        const username = form.get('username');
        const password = form.get('password');

        if (
          typeof firstname !== 'string' ||
          typeof lastname !== 'string' ||
          typeof username !== 'string' ||
          typeof password !== 'string'
        ) {
          throw new AuthorizationError('Ungültiges Formular');
        }

        const user = await register(firstname, lastname, username, password);
        return user;
      }
      default:
        throw new AuthorizationError('Ungültiges Formular');
    }
  }),
  'user-pass'
);
