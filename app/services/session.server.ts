import { createCookieSessionStorage } from '@remix-run/node';

const cookieSecret = process.env.COOKIE_SECRET;
if (!cookieSecret) {
  throw new Error('COOKIE_SECRET must be set');
}

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '_session',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
    sameSite: 'lax',
    secrets: [cookieSecret],
    secure: process.env.NODE_ENV === 'production'
  }
});
