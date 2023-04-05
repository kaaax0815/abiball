import { decode as decodeMsgPack, encode as encodeMsgPack } from '@msgpack/msgpack';
import type { Ticket } from '@prisma/client';
import bwip from 'bwip-js';
import crypto from 'crypto';

import { dateToUnix } from './time.server';

export function generateAztec(ticket: Ticket) {
  const data = encodeData(HEADER, generatePayload(ticket));
  const signature = generateSignature(data);
  const content = encodeContent(data, signature);

  return bwip.toBuffer({
    bcid: 'azteccode',
    text: content,
    height: 30,
    width: 30
  });
}

export function verifyAztec(content: string) {
  const [header, payload, signature] = content.split('.');
  const verifiedHeader = verifyHeader(header);
  if (!verifiedHeader) {
    return null;
  }
  if (!verifySignature(payload, signature)) {
    return null;
  }
  return decodePayload(payload);
}

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
  const decodedData = decodeBase64UrlToString(data);
  const decodedSignature = decodeBase64UrlToString(signature);
  return (
    crypto.createHmac('sha256', loadQRSecret()).update(decodedData).digest('base64url') ===
    decodedSignature
  );
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
    owner: ticket.userId,
    firstname: ticket.firstname,
    lastname: ticket.lastname,
    createdAt: dateToUnix(ticket.createdAt),
    updatedAt: dateToUnix(ticket.updatedAt),
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
  return crypto.createHmac('sha256', loadQRSecret()).update(data).digest('base64url');
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

export function loadQRSecret() {
  const qrSecret = process.env.QR_SECRET;
  if (!qrSecret) {
    throw new Error('QR_SECRET must be set');
  }
  return qrSecret;
}
