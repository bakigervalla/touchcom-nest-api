import { Logger } from '@nestjs/common';
import { Address, PrismaClient, Site } from '@prisma/client';

const prisma = new PrismaClient();

const createSites = async (address: Address): Promise<Site[]> => {
  const logger = new Logger('Seed');

  logger.verbose('Creating dummy sites...');

  const site1: Site = await prisma.site.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Site 1',
      description: 'Site 1 description',
      addressId: address.id,
    },
  });

  const site2: Site = await prisma.site.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Site 2',
      description: 'Site 2 description',
      addressId: address.id,
      floor: 3,
    },
  });

  logger.verbose('Dummy sites created successfully');

  return [site1, site2];
};

export default { createSites };
