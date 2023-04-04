import { json } from '@remix-run/node';

export const badRequest = <T>(data: T) => json<T>(data, { status: 400 });

export const notFound = <T>(data: T) => json<T>(data, { status: 404 });

export const forbidden = <T>(data: T) => json<T>(data, { status: 403 });

export async function fetchImage(location: string) {
  const response = await fetch(location);
  if (!response.ok) {
    throw new Error(`Unable to fetch image from ${location}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return buffer;
}

export function getOrigin(request: Request) {
  const url = new URL(request.url);
  return `${url.protocol}//${url.host}`;
}
