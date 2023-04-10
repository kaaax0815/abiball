import type { Ticket } from '@prisma/client';
import bwip from 'bwip-js';

import {
  decodePayload,
  encodeContent,
  encodeData,
  generatePayload,
  generateSignature,
  HEADER,
  verifyHeader,
  verifySignature
} from '~/utils/aztec.server';

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
    throw new Error('Ungültiger KAC Header');
  }
  if (!verifySignature(`${header}.${payload}`, signature)) {
    throw new Error('Ungültige KAC Signatur');
  }
  return decodePayload(payload);
}
