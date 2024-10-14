import { Logger } from '@nestjs/common';
import { PrismaClient, AccessKeyProvider } from '@prisma/client';

const prisma = new PrismaClient();

const createAccessKeyProvider = async (): Promise<AccessKeyProvider[]> => {
  const logger = new Logger('Seed');

  logger.verbose('Creating dummy access key provider...');

  const touchcomProvider: AccessKeyProvider =
    await prisma.accessKeyProvider.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        name: 'Touchcom',
        email: 'dev@touchcom.no',
      },
    });

  logger.verbose(
    'Dummy access key provider created: ',
    [touchcomProvider.name].join(', '),
  );

  return [touchcomProvider];
};

export default { createAccessKeyProvider };
