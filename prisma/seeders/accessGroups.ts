import { Logger } from '@nestjs/common';
import {
  PrismaClient,
  AccessGroup,
  Site,
  AccessGroupStatus,
} from '@prisma/client';

const prisma = new PrismaClient();

const createAccessGroups = async (sites: Site[]): Promise<AccessGroup[]> => {
  const logger = new Logger('Seed');

  logger.verbose('Creating dummy access groups...');

  const accessGroup1: AccessGroup = await prisma.accessGroup.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Group 1',
      color: '#db394f',
      status: AccessGroupStatus.ACTIVE,
      siteId: sites[0].id,
    },
  });

  const accessGroup2: AccessGroup = await prisma.accessGroup.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      name: 'Group 2',
      color: '#f7de02',
      status: AccessGroupStatus.INACTIVE,
      siteId: sites[0].id,
    },
  });

  const accessGroup3: AccessGroup = await prisma.accessGroup.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      name: 'Group 3',
      status: AccessGroupStatus.ACTIVE,
      siteId: sites[1].id,
    },
  });

  logger.verbose(
    'Dummy access groups created: ',
    [accessGroup1.name, accessGroup2.name, accessGroup3.name].join(', '),
  );

  return [accessGroup1, accessGroup2, accessGroup3];
};

export default { createAccessGroups };
