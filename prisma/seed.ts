import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

async function seed() {
  const kody = await db.user.create({
    data: {
      firstname: 'Kody',
      lastname: 'Baker',
      email: 'kody@test.com',
      admin: true,
      verified: true,
      passwordHash: '$2y$10$efzH6cGv7oz787zbvleZDOsEYZUuZ0DJlsnE3f9veQHY8qDlf/ck6'
    }
  });

  const kodyTicket = await db.ticket.create({
    data: {
      firstname: 'Kody',
      lastname: 'Baker',
      owner: {
        connect: {
          id: kody.id
        }
      }
    }
  });

  const aliceTicket = await db.ticket.create({
    data: {
      firstname: 'Alice',
      lastname: 'Baker',
      owner: {
        connect: {
          id: kody.id
        }
      }
    }
  });

  return { kody, kodyTicket, aliceTicket };
}

seed();
