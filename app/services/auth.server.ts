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
        const email = form.get('email');
        const password = form.get('password');

        if (typeof email !== 'string' || typeof password !== 'string') {
          throw new AuthorizationError('Ungültiges Formular');
        }

        const user = await login(email, password);
        return user;
      }
      case 'register': {
        const firstname = form.get('firstname');
        const lastname = form.get('lastname');
        const email = form.get('email');
        const password = form.get('password');

        if (
          typeof firstname !== 'string' ||
          typeof lastname !== 'string' ||
          typeof email !== 'string' ||
          typeof password !== 'string'
        ) {
          throw new AuthorizationError('Ungültiges Formular');
        }

        const user = await register(firstname, lastname, email, password);
        return user;
      }
      default:
        throw new AuthorizationError('Ungültiges Formular');
    }
  }),
  'user-pass'
);
