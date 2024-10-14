import { Logger } from '@nestjs/common';
import {
  AccessGroup,
  AccessKeyProvider,
  Device,
  PrismaClient,
  User,
  UserSite,
} from '@prisma/client';

import accessKey from './accessKey';

const prisma = new PrismaClient();

const createAccessControl = async (
  users: (User & { sites: UserSite[] })[],
  devices: Device[],
  accessGroups: AccessGroup[],
  accessProviders: AccessKeyProvider[],
) => {
  const logger = new Logger('Seed');

  logger.verbose('Creating dummy access control...');

  let totalUsers = 0;
  devices.forEach((device: Device, rowId: number) => {
    const usersAtSameSite = users.filter((user) =>
      user.sites.some((userSite) => userSite.siteId === device.siteId),
    );
    usersAtSameSite.forEach(async (user: User, columnId: number) => {
      const randomAccessGroupIndex = Math.floor(
        Math.random() * accessGroups.length,
      );
      const accessControl = await prisma.accessControl.upsert({
        where: {
          id: rowId * totalUsers + columnId,
        },
        update: {},
        create: {
          userId: user.id,
          deviceId: device.id,
          accessGroupId: accessGroups[randomAccessGroupIndex].id,
          isVisible: !user.email.includes('installer'),
        },
      });
      await accessKey.createAccessKey(
        device.siteId,
        accessControl.id,
        accessProviders[0].id,
      );
    });
    totalUsers = usersAtSameSite.length - 1;
  });

  logger.verbose('Dummy access control created successfully');
};

export default { createAccessControl };
