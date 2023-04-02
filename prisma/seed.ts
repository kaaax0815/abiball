import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

async function seed() {
  const kody = await db.user.create({
    data: {
      firstname: 'Kody',
      lastname: 'Baker',
      username: 'kody',
      passwordHash: '$2y$10$efzH6cGv7oz787zbvleZDOsEYZUuZ0DJlsnE3f9veQHY8qDlf/ck6'
    }
  });

  const kodyTicket = await db.ticket.create({
    data: {
      firstName: 'Kody',
      lastName: 'Baker',
      owner: {
        connect: {
          username: 'kody'
        }
      }
    }
  });

  const aliceTicket = await db.ticket.create({
    data: {
      firstName: 'Alice',
      lastName: 'Baker',
      owner: {
        connect: {
          username: 'kody'
        }
      }
    }
  });

  return { kody, kodyTicket, aliceTicket };
}

seed();
