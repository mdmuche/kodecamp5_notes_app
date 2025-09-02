import { PrismaClient } from '@prisma/client';
import { getPasswordHash } from 'src/utils/auth';

const prisma = new PrismaClient();

async function main() {
  const hash = await getPasswordHash('password');
  const userEmail = 'tony@max.com';
  const userName = 'tony max';
  const user = await prisma.user.create({
    data: {
      email: userEmail,
      name: userName,
      password: {
        create: {
          hash,
        },
      },
    },
  });

  await prisma.note.createMany({
    data: [
      {
        title: 'welcome note',
        content: 'this is your first note',
        userId: user.id,
      },
      {
        title: 'getting started',
        content: 'this is your second note',
        userId: user.id,
      },
    ],
  });

  console.log('database seeded');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  .finally(async () => {
    await prisma.$disconnect();
  });
