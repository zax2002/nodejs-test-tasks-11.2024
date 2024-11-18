import { PrismaClient } from '@prisma/client';
import { profile } from 'random-profile-generator';
import { SingleBar, Presets } from 'cli-progress';

const prisma = new PrismaClient();

async function main() {
  const BATCH_SIZE = 100000;
  const USERS_AMOUNT = 1200000;

  console.log('Seeding users..');

  const progressBar = new SingleBar({}, Presets.shades_classic);
  progressBar.start(USERS_AMOUNT, 0);

  const newUsers = [];

  for (let i = 0; i < USERS_AMOUNT; i++) {
    const randomProfile = profile();

    const newUser = {
      first_name: randomProfile.firstName,
      last_name: randomProfile.lastName,
      age: randomProfile.age,

      gender: null,
      has_problems: null,
    };

    if (Math.random() > 0.1) {
      newUser.gender = randomProfile.gender == 'Male';
    }
    newUser.has_problems = Math.random() > 0.95;

    newUsers.push(newUser);

    progressBar.increment();

    if (
      newUsers.length == BATCH_SIZE ||
      (i + 1 == USERS_AMOUNT && newUsers.length > 0)
    ) {
      await prisma.user.createMany({ data: newUsers });

      newUsers.length = 0;
    }
  }

  progressBar.stop();

  console.log('Done');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
