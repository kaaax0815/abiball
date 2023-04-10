import bcrypt from 'bcryptjs';
import { AuthorizationError } from 'remix-auth';

import { authenticator } from '~/services/auth.server';

import { db } from './db.server';
import {
  emailAlreadyExists,
  validateEmail,
  validateFirstname,
  validateLastname,
  validatePassword
} from './validation.server';

export async function login(email: string, password: string) {
  const user = await db.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new AuthorizationError('Email-Adresse oder Passwort falsch');
  }

  const isCorrectPassword = await bcrypt.compare(password, user.passwordHash);

  if (!isCorrectPassword) {
    throw new AuthorizationError('Email-Adresse oder Passwort falsch');
  }

  return { userId: user.id };
}

export async function register(
  firstname: string,
  lastname: string,
  email: string,
  password: string
) {
  validateFirstname(firstname);
  validateLastname(lastname);
  validateEmail(email);
  await emailAlreadyExists(email);
  validatePassword(password);
  const user = await db.user.create({
    data: {
      firstname,
      lastname,
      email,
      passwordHash: await bcrypt.hash(password, 10)
    }
  });

  return { userId: user.id };
}

export async function invalidateSession(request: Request) {
  throw await authenticator.logout(request, {
    redirectTo: '/login'
  });
}
