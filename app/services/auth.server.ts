import { Authenticator, AuthorizationError } from 'remix-auth';
import { FormStrategy } from 'remix-auth-form';

import { sessionStorage } from '~/services/session.server';
import { login } from '~/utils/auth.server';

export type AuthData = {
  userId: string;
};

export const authenticator = new Authenticator<AuthData>(sessionStorage);

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const username = form.get('username');
    const password = form.get('password');

    if (typeof username !== 'string' || typeof password !== 'string') {
      throw new AuthorizationError('Invalid username or password');
    }

    const user = await login(username, password);
    return user;
  }),
  'user-pass'
);
