import { PrismaClient } from '@prisma/client';

import accessKeyProvider from './accessKeyProvider';
import countries from './countries';
import permissions from './permissions';
import roles from './roles';
import users from './users';
import versions from './versions';

const prisma = new PrismaClient();

const seed = async () => {
  await versions.createVersion();
  await accessKeyProvider.createAccessKeyProvider();
  const createdRoles = await roles.createRoles();
  const createdPermissions = await permissions.createPermissions();
  const standardUserRole = createdRoles.find(
    (role) => role.key === 'STANDARD_USER',
  );
  const siteAdminRole = createdRoles.find((role) => role.key === 'SITE_ADMIN');
  const superAdminRole = createdRoles.find(
    (role) => role.key === 'SUPER_ADMIN',
  );
  const deviceSetupRole = createdRoles.find(
    (role) => role.key === 'DEVICE_SETUP',
  );
  const adminUserPermissions = createdPermissions.filter(
    (permission) => permission.key !== 'DEVICE',
  );
  const standardUserPermissions = createdPermissions.filter(
    (permission) =>
      permission.key === 'MOBILE' ||
      permission.key === 'OPEN_DOOR' ||
      permission.key === 'ENABLE_VOICE' ||
      permission.key === 'ENABLE_VIDEO',
  );
  const deviceSetupPermissions = createdPermissions.filter(
    (permission) =>
      permission.key === 'DEVICE' ||
      permission.key === 'ENABLE_VOICE' ||
      permission.key === 'ENABLE_VIDEO',
  );
  await roles.attachPermissionsToRole(
    standardUserPermissions,
    standardUserRole,
  );
  await roles.attachPermissionsToRole(adminUserPermissions, siteAdminRole);
  await roles.attachPermissionsToRole(adminUserPermissions, superAdminRole);
  await roles.attachPermissionsToRole(deviceSetupPermissions, deviceSetupRole);

  await countries.createCountries();
  await users.createUsers(createdRoles);
};

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
