import { Logger } from '@nestjs/common';
import { Permission, PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

const createRoles = async (): Promise<Role[]> => {
  const logger = new Logger('Seed');

  logger.verbose('Creating roles...');

  const role1: Role = await prisma.role.upsert({
    where: { key: 'STANDARD_USER' },
    update: {},
    create: {
      key: 'STANDARD_USER',
      name: 'Standard User',
    },
  });

  const role2: Role = await prisma.role.upsert({
    where: { key: 'SITE_ADMIN' },
    update: {},
    create: {
      key: 'SITE_ADMIN',
      name: 'Site Admin',
    },
  });

  const role3: Role = await prisma.role.upsert({
    where: { key: 'SUPER_ADMIN' },
    update: {},
    create: {
      key: 'SUPER_ADMIN',
      name: 'Super Admin',
    },
  });

  const deviceSetupRole: Role = await prisma.role.upsert({
    where: { key: 'DEVICE_SETUP' },
    update: {},
    create: {
      key: 'DEVICE_SETUP',
      name: 'Device Setup',
    },
  });

  logger.verbose('Roles created successfully');

  return [role1, role2, role3, deviceSetupRole];
};

const attachPermissionsToRole = async (
  permissions: Permission[],
  role: Role,
) => {
  permissions.forEach(async (permission: Permission) => {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: { roleId: role.id, permissionId: permission.id },
      },
      update: {},
      create: {
        roleId: role.id,
        permissionId: permission.id,
      },
    });
  });
};

export default { attachPermissionsToRole, createRoles };
