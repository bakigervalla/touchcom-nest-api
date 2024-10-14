import { Logger } from '@nestjs/common';
import { Address, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createAddress = async (): Promise<Address> => {
  const logger = new Logger('Seed');

  logger.verbose('Creating dummy address...');

  const address: Address = await prisma.address.upsert({
    where: { id: 1 },
    update: {},
    create: {
      street: 'Halloween Road',
      number: '25/17',
      city: 'City',
      postalCode: '5555',
    },
  });

  logger.verbose('Dummy address created successfully');

  return address;
};

export default { createAddress };
