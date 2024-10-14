import { Logger } from '@nestjs/common';
import { Configuration, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createConfiguration = async (): Promise<Configuration> => {
  const logger = new Logger('Seed');

  logger.verbose('Creating dummy configurations...');

  const configuration: Configuration = await prisma.configuration.upsert({
    where: { id: 1 },
    update: {},
    create: {
      height: 0,
      width: 0,
      aspectRatioX: 0,
      aspectRatioY: 0,
    },
  });

  logger.verbose('Dummy configurations created successfully');

  return configuration;
};

export default { createConfiguration };
