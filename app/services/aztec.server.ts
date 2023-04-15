import bwip from 'bwip-js';

import type { Payload } from '~/utils/aztec.server';
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

export function generateAztec(ticket: Payload) {
  const data = encodeData(HEADER, generatePayload(ticket));
  const signature = generateSignature(data);
  const content = encodeContent(data, signature);

  return bwip.toBuffer({
    bcid: 'azteccode',
    text: content,
    // 285px
    height: 55,
    width: 55
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
