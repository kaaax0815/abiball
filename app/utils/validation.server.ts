import { AuthorizationError } from 'remix-auth';

import { db } from './db.server';

export async function validateUsername(username: string) {
  if (username.length < 3) {
    throw new AuthorizationError('Benutzername muss mindestens 3 Zeichen lang sein');
  }

  const user = await db.user.findUnique({
    where: { username }
  });

  if (user) {
    throw new AuthorizationError('Benutzername bereits vergeben');
  }
}

export function validateFirstname(username: string) {
  if (username.length < 3) {
    return `Vorname muss mindestens 3 Zeichen lang sein`;
  }
}

export function validateLastname(username: string) {
  if (username.length < 3) {
    return `Nachname muss mindestens 3 Zeichen lang sein`;
  }
}

export function validatePassword(password: string) {
  if (password.length < 8) {
    return `Passwort muss mindestens 8 Zeichen lang sein`;
  }
}
