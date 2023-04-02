import { createCookieSessionStorage, redirect } from '@remix-run/node';
import bcrypt from 'bcryptjs';

import { db } from './db.server';
import { requireLogin } from './request.server';

type SessionData = {
  userId: string;
};

type LoginForm = {
  username: string;
  password: string;
};

type RegisterForm = {
  firstname: string;
  lastname: string;
  username: string;
  password: string;
};

export async function login({ username, password }: LoginForm) {
  const user = await db.user.findUnique({
    where: { username }
  });

  if (!user) {
    return null;
  }

  const isCorrectPassword = await bcrypt.compare(password, user.passwordHash);

  if (!isCorrectPassword) {
    return null;
  }

  return { id: user.id, username };
}

export async function register({ firstname, lastname, username, password }: RegisterForm) {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await db.user.create({
    data: { firstname, lastname, username, passwordHash }
  });
  return { id: user.id, username };
}

const cookieSecret = process.env.COOKIE_SECRET;
if (!cookieSecret) {
  throw new Error('COOKIE_SECRET must be set');
}

const storage = createCookieSessionStorage<SessionData>({
  // a Cookie from `createCookie` or the CookieOptions to create one
  cookie: {
    name: '__session',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
    sameSite: 'lax',
    secrets: [cookieSecret],
    secure: process.env.NODE_ENV === 'production'
  }
});

function getUserSession(request: Request) {
  return storage.getSession(request.headers.get('Cookie'));
}

export async function getUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get('userId');
  if (!userId || typeof userId !== 'string') {
    return null;
  }
  return userId;
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const userId = await getUserId(request);
  if (!userId) {
    throw requireLogin(redirectTo);
  }
  return userId;
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (typeof userId !== 'string') {
    return null;
  }

  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      include: { tickets: true }
    });
    return user;
  } catch {
    throw logout(request);
  }
}

export async function logout(request: Request) {
  const session = await getUserSession(request);
  return redirect('/', {
    headers: {
      'Set-Cookie': await storage.destroySession(session)
    }
  });
}

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession();
  session.set('userId', userId);
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await storage.commitSession(session)
    }
  });
}
