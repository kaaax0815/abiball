import { redirect } from '@remix-run/node';
import bcrypt from 'bcryptjs';
import { AuthorizationError } from 'remix-auth';

import { authenticator } from '~/services/auth.server';

import { db, isAdmin, isVerified } from './db.server';
import type { ALLOWED_URLS } from './redirect.server';
import { DEFAULT_REDIRECT_URL } from './redirect.server';
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

export async function invalidateSession(
  request: Request,
  redirectTo: string = DEFAULT_REDIRECT_URL
) {
  throw await authenticator.logout(request, {
    redirectTo: `/login?redirectTo=${redirectTo}`
  });
}

export async function isAuthenticated(
  request: Request,
  {
    redirectTo = DEFAULT_REDIRECT_URL,
    checkVerified = false,
    checkAdmin = false
  }: {
    redirectTo?: (typeof ALLOWED_URLS)[number];
    checkVerified?: boolean;
    checkAdmin?: boolean;
  }
) {
  let verified: boolean | null = null;
  let admin: boolean | null = null;

  const { userId } = await authenticator.isAuthenticated(request, {
    failureRedirect: `/login?redirectTo=${redirectTo}`
  });

  if (checkVerified) {
    verified = await isVerified(userId);
    if (verified === false) {
      throw redirect('/verify');
    } else if (verified === null) {
      throw await invalidateSession(request, redirectTo);
    }
  }

  if (checkAdmin) {
    admin = await isAdmin(userId);
    if (admin === false) {
      throw redirect('/');
    } else if (admin === null) {
      throw await invalidateSession(request, redirectTo);
    }
  }

  return { userId, admin, verified };
}
