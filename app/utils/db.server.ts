import { PrismaClient } from '@prisma/client';

let db: PrismaClient;

declare global {
  // eslint-disable-next-line no-var
  var __db: PrismaClient | undefined;
}

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
if (process.env.NODE_ENV === 'production') {
  db = new PrismaClient();
} else {
  if (!global.__db) {
    global.__db = new PrismaClient();
  }
  db = global.__db;
}

export { db };

export async function isVerified(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { verified: true }
  });
  return user?.verified ?? false;
}
