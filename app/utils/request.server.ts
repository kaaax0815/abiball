import { json, redirect } from '@remix-run/node';

export const badRequest = <T>(data: T) => json<T>(data, { status: 400 });

export function requireLogin(redirectTo: string) {
  const searchParams = new URLSearchParams([['redirectTo', redirectTo]]);
  return redirect(`/login?${searchParams}`);
}

export function validateRedirectUrl(url: string) {
  let urls = ['/tickets', '/'];
  if (urls.includes(url)) {
    return url;
  }
  return '/tickets';
}
