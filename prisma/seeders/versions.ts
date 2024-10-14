import { Logger } from '@nestjs/common';
import { PrismaClient, Version } from '@prisma/client';

const prisma = new PrismaClient();

const createVersion = async (): Promise<Version> => {
  const logger = new Logger('Seed');

  logger.verbose('Creating dummy versions...');

  const version: Version = await prisma.version.upsert({
    where: { id: 1 },
    update: {},
    create: {
      tag: '0.0.1',
      fileUrl: '',
    },
  });

  logger.verbose('Dummy versions created successfully');

  return version;
};

export default { createVersion };
