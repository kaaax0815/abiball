import crypto from 'crypto';

import renderResetPassword from '~/emails/reset-password';
import renderVerify from '~/emails/verify';
import { transporter } from '~/services/mail.server';

import { getOrigin } from './request.server';
import { dateToUnix } from './time.server';

export type MailMethods = 'verify' | 'reset-password';

export async function sendMail(
  request: Request,
  method: MailMethods,
  to: { name: string; address: string }
) {
  const origin = getOrigin(request);
  switch (method) {
    case 'verify': {
      const verifyToken = createVerifyToken(to);
      const content = renderVerify({
        logoUrl: `${origin}/Logo.png`,
        verifyUrl: `${origin}/api/mail?token=${verifyToken}`
      });
      const mail = await transporter.sendMail({
        from: {
          name: 'Abiball',
          address: loadEmailSender()
        },
        to: {
          name: to.name,
          address: to.address
        },
        subject: 'Abiball: Verifiziere deine E-Mail-Adresse',
        html: content.html,
        text: content.text
      });
      return mail;
    }
    case 'reset-password': {
      const resetToken = createResetToken(to);
      const content = renderResetPassword({
        logoUrl: `${origin}/Logo.png`,
        resetUrl: `${origin}/password?token=${resetToken}`
      });
      const mail = await transporter.sendMail({
        from: {
          name: 'Abiball',
          address: loadEmailSender()
        },
        to: {
          name: to.name,
          address: to.address
        },
        subject: 'Abiball: Setze ein neues Passwort',
        html: content.html,
        text: content.text
      });
      return mail;
    }
  }
}

function createToken(payload: Record<string, string | number>) {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const hmac = crypto.createHmac('sha256', loadEmailSecret()).update(data).digest('base64url');
  return `${data}.${hmac}`;
}

function verifyToken(type: MailMethods, token: string) {
  const [data, hmac] = token.split('.');
  const hmac2 = crypto.createHmac('sha256', loadEmailSecret()).update(data).digest('base64url');
  if (hmac !== hmac2) {
    throw new Error('Ungültiger Token');
  }
  const payload = JSON.parse(Buffer.from(data, 'base64url').toString());
  if (payload.type !== type) {
    throw new Error('Ungültiger Token');
  }
  if (payload.exp < dateToUnix(new Date())) {
    throw new Error('Token abgelaufen');
  }
  if (typeof payload.email !== 'string') {
    throw new Error('Ungültiger Token');
  }
  return payload.email as string;
}

export function createVerifyToken(to: { address: string }) {
  const payload = {
    email: to.address,
    type: 'verify',
    // 15 minutes
    exp: dateToUnix(new Date(Date.now() + 1000 * 60 * 15))
  };
  return createToken(payload);
}

export function verifyVerifyToken(token: string) {
  return verifyToken('verify', token);
}

export function createResetToken(to: { address: string }) {
  const payload = {
    email: to.address,
    type: 'reset-password',
    // 15 minutes
    exp: dateToUnix(new Date(Date.now() + 1000 * 60 * 15))
  };
  return createToken(payload);
}

export function verifyResetToken(token: string) {
  return verifyToken('reset-password', token);
}

export function loadEmailSecret() {
  const emailSecret = process.env.EMAIL_SECRET;
  if (!emailSecret) {
    throw new Error('EMAIL_SECRET not set');
  }
  return emailSecret;
}

export function loadEmailSender() {
  const emailSender = process.env.SENDINBLUE_SENDER;
  if (!emailSender) {
    throw new Error('SENDINBLUE_SENDER not set');
  }
  return emailSender;
}
