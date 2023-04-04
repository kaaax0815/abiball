import bcrypt from 'bcryptjs';
import { AuthorizationError } from 'remix-auth';

import { db } from './db.server';

export async function login(username: string, password: string) {
  const user = await db.user.findUnique({
    where: { username }
  });

  if (!user) {
    throw new AuthorizationError('Benutzername oder Passwort falsch');
  }

  const isCorrectPassword = await bcrypt.compare(password, user.passwordHash);

  if (!isCorrectPassword) {
    throw new AuthorizationError('Benutzername oder Passwort falsch');
  }

  return { userId: user.id };
}
