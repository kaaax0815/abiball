import bcrypt from 'bcryptjs';
import { AuthorizationError } from 'remix-auth';

import { db } from './db.server';
import {
  validateFirstname,
  validateLastname,
  validatePassword,
  validateUsername
} from './validation.server';

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

export async function register(
  firstname: string,
  lastname: string,
  username: string,
  password: string
) {
  validateFirstname(firstname);
  validateLastname(lastname);
  await validateUsername(username);
  validatePassword(password);
  const user = await db.user.create({
    data: {
      firstname,
      lastname,
      username,
      passwordHash: await bcrypt.hash(password, 10)
    }
  });

  return { userId: user.id };
}
