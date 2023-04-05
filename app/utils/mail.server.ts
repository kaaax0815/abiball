import crypto from 'crypto';

import { transporter } from '~/services/mail.server';
import verifyTemplate from '~/views/verify.server';

import { getOrigin } from './request.server';
import { dateToUnix } from './time.server';

export type MailMethods = 'verify' | 'reset-password' | 'welcome';
export const DEFAULT_SENDER = `Abiball <${process.env.SENDINBLUE_SENDER}>`;

export async function sendMail(request: Request, method: MailMethods, to: string) {
  const origin = getOrigin(request);
  switch (method) {
    case 'verify': {
      const verifyToken = createVerifyToken(to);
      const mail = await transporter.sendMail({
        from: DEFAULT_SENDER,
        to,
        subject: 'Abiball: Verifiziere deine E-Mail-Adresse',
        html: verifyTemplate({
          origin: origin,
          logo: `${origin}/Abimotto.png`,
          verify_url: `${origin}/api/mail?token=${verifyToken}`
        })
      });
      return mail;
    }
  }
}

export function createVerifyToken(email: string) {
  const payload = {
    email,
    type: 'verify',
    // 15 minutes
    exp: dateToUnix(new Date(Date.now() + 1000 * 60 * 15))
  };
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const hmac = crypto.createHmac('sha256', loadEmailSecret()).update(data).digest('base64url');
  return `${data}.${hmac}`;
}

export function verifyVerifyToken(token: string) {
  const [data, hmac] = token.split('.');
  const hmac2 = crypto.createHmac('sha256', loadEmailSecret()).update(data).digest('base64url');
  if (hmac !== hmac2) {
    throw new Error('Invalid token');
  }
  const payload = JSON.parse(Buffer.from(data, 'base64url').toString());
  if (payload.type !== 'verify') {
    throw new Error('Invalid token');
  }
  if (payload.exp < dateToUnix(new Date())) {
    throw new Error('Token expired');
  }
  if (typeof payload.email !== 'string') {
    throw new Error('Invalid token');
  }
  return payload.email as string;
}

export function loadEmailSecret() {
  const emailSecret = process.env.EMAIL_SECRET;
  if (!emailSecret) {
    throw new Error('EMAIL_SECRET not set');
  }
  return emailSecret;
}
