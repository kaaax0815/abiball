import { AuthorizationError } from 'remix-auth';

import { db } from './db.server';

export async function validateEmail(email: string) {
  if (email.length < 3) {
    throw new AuthorizationError('Email-Adresse muss mindestens 3 Zeichen lang sein');
  }

  if (!email.includes('@')) {
    throw new AuthorizationError('Ungültige Email-Adresse');
  }

  const [local, domain] = email.split('@');
  if (local.length < 1 || domain.length < 3) {
    throw new AuthorizationError('Ungültige Email-Adresse');
  }
  const [domainName, domainExtension] = domain.split('.');
  if (domainName.length < 1 || domainExtension.length < 2) {
    throw new AuthorizationError('Ungültige Email-Adresse');
  }

  const user = await db.user.findUnique({
    where: { email }
  });

  if (user) {
    throw new AuthorizationError('Email-Adresse bereits vergeben');
  }
}

export function validateFirstname(firstname: string) {
  if (firstname.length < 3) {
    throw new AuthorizationError(`Vorname muss mindestens 3 Zeichen lang sein`);
  }
}

export function validateLastname(lastname: string) {
  if (lastname.length < 3) {
    throw new AuthorizationError(`Nachname muss mindestens 3 Zeichen lang sein`);
  }
}

export function validatePassword(password: string) {
  if (password.length < 8) {
    throw new AuthorizationError(`Passwort muss mindestens 8 Zeichen lang sein`);
  }
}
