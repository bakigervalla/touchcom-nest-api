import { Logger } from '@nestjs/common';
import { PrismaClient, AccessKey } from '@prisma/client';

const prisma = new PrismaClient();

const createAccessKey = async (
  siteId: number,
  accessControlId: number,
  accessKeyProviderId: number,
): Promise<AccessKey> => {
  const logger = new Logger('Seed');

  logger.verbose('Creating dummy access key...');

  const tag = Math.random().toString(36).substring(2, 15);
  const accessKey: AccessKey = await prisma.accessKey.upsert({
    where: { id: accessControlId },
    update: {},
    create: {
      id: accessControlId,
      name: `Access Key #${tag}`,
      tag,
      pin: '123',
      consumption: 1,
      failedAccessAttempts: 0,
      description: `Access Key ${accessControlId} desc`,
      siteId,
      accessControlId,
      accessKeyProviderId,
    },
  });

  logger.verbose('Dummy access key created: ', [accessKey.tag].join(', '));

  return accessKey;
};

export default { createAccessKey };
