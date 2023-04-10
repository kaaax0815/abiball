import { decode as decodeMsgPack, encode as encodeMsgPack } from '@msgpack/msgpack';
import type { Ticket } from '@prisma/client';
import crypto from 'crypto';

import { dateToUnix } from './time.server';

export function verifyHeader(header: string) {
  try {
    const decodedHeader = decodeBase64UrlToObject(header);
    if (decodedHeader.typ !== HEADER.typ) {
      return null;
    }
    if (decodedHeader.alg !== HEADER.alg) {
      return null;
    }
    if (decodedHeader.cty !== HEADER.cty) {
      return null;
    }
    return decodedHeader as typeof HEADER;
  } catch (e) {
    return null;
  }
}

export function verifySignature(data: string, signature: string) {
  return generateSignature(data) === signature;
}

export function decodePayload(payload: string) {
  const decodedPayload = decodeBase64UrlToBuffer(payload);
  return decodeMsgPack(decodedPayload) as Record<string, string | number>;
}

export const HEADER = {
  /** @description kaaax Aztec Code */
  typ: 'KAC',
  alg: 'HS256',
  cty: 'MSGPACK'
};

export function generatePayload(ticket: Ticket) {
  const payload = {
    id: ticket.id,
    ownerId: ticket.ownerId,
    generatedAt: dateToUnix(new Date())
  };

  return encodeMsgPack(payload);
}

export function encodeData(header: Record<string, string>, payload: Uint8Array) {
  const encodedHeader = encodeBase64Url(JSON.stringify(header));
  const encodedPayload = encodeBase64Url(payload);

  return `${encodedHeader}.${encodedPayload}`;
}

export function generateSignature(data: string) {
  return crypto.createHmac('sha256', loadAztecSecret()).update(data).digest('base64url');
}

export function encodeContent(data: string, signature: string) {
  return `${data}.${signature}`;
}

export function encodeBase64Url(data: string | Uint8Array) {
  return Buffer.from(data).toString('base64url');
}

export function decodeBase64UrlToBuffer(data: string) {
  return Buffer.from(data, 'base64url');
}

export function decodeBase64UrlToString(data: string) {
  return decodeBase64UrlToBuffer(data).toString();
}

export function decodeBase64UrlToObject(data: string): Record<string, string> {
  return JSON.parse(decodeBase64UrlToString(data));
}

export function loadAztecSecret() {
  const aztecSecret = process.env.AZTEC_SECRET;
  if (!aztecSecret) {
    throw new Error('AZTEC_SECRET must be set');
  }
  return aztecSecret;
}
