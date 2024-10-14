import { Logger } from '@nestjs/common';
import { PrismaClient, Permission, PermissionType } from '@prisma/client';

const prisma = new PrismaClient();

const createPermissions = async (): Promise<Permission[]> => {
  const logger = new Logger('Seed');

  logger.verbose('Creating permissions...');

  const permission1: Permission = await prisma.permission.upsert({
    where: { key: 'ADMIN_WEB' },
    update: {},
    create: {
      key: 'ADMIN_WEB',
      name: 'Admin Web access',
      type: PermissionType.ACCESS,
      description: 'Used to enable user access to admin device web app.',
    },
  });

  const permission2: Permission = await prisma.permission.upsert({
    where: { key: 'DEVICE' },
    update: {},
    create: {
      key: 'DEVICE',
      name: 'Device Access',
      type: PermissionType.ACCESS,
      description: 'Used to enable user access to the device.',
    },
  });

  const permission3: Permission = await prisma.permission.upsert({
    where: { key: 'MOBILE' },
    update: {},
    create: {
      key: 'MOBILE',
      name: 'Mobile Access',
      type: PermissionType.ACCESS,
      description: 'Used to enable user access to mobile app.',
    },
  });

  const permission4: Permission = await prisma.permission.upsert({
    where: { key: 'FIRMWARE_UPDATE' },
    update: {},
    create: {
      key: 'FIRMWARE_UPDATE',
      name: 'Firmware update',
      type: PermissionType.DEVICE_EVENT,
      description: 'Used to enable user to update device firmware.',
    },
  });

  const permission5: Permission = await prisma.permission.upsert({
    where: { key: 'RESIDENTS_UPDATE' },
    update: {},
    create: {
      key: 'RESIDENTS_UPDATE',
      name: 'Residents update',
      type: PermissionType.DEVICE_EVENT,
      description: 'Used to enable user to update residents stored on device.',
    },
  });

  const permission6: Permission = await prisma.permission.upsert({
    where: { key: 'ACCESS_KEYS_UPDATE' },
    update: {},
    create: {
      key: 'ACCESS_KEYS_UPDATE',
      name: 'Access keys update',
      type: PermissionType.DEVICE_EVENT,
      description:
        'Used to enable user to update access keys stored on device.',
    },
  });

  const permission7: Permission = await prisma.permission.upsert({
    where: { key: 'MAIN_SETTINGS_UPDATE' },
    update: {},
    create: {
      key: 'MAIN_SETTINGS_UPDATE',
      name: 'Main settings update',
      type: PermissionType.DEVICE_EVENT,
      description: 'Used to enable user to update device main settings.',
    },
  });

  const permission8: Permission = await prisma.permission.upsert({
    where: { key: 'OPEN_ANDROID_SETTINGS' },
    update: {},
    create: {
      key: 'OPEN_ANDROID_SETTINGS',
      name: 'Open android settings',
      type: PermissionType.DEVICE_EVENT,
      description: 'Used to enable user to open device android settings.',
    },
  });

  const permission9: Permission = await prisma.permission.upsert({
    where: { key: 'CLOSE_ANDROID_SETTINGS' },
    update: {},
    create: {
      key: 'CLOSE_ANDROID_SETTINGS',
      name: 'Close android settings',
      type: PermissionType.DEVICE_EVENT,
      description: 'Used to enable user to close device android settings.',
    },
  });

  const permission10: Permission = await prisma.permission.upsert({
    where: { key: 'OPEN_ROOT_SETTINGS' },
    update: {},
    create: {
      key: 'OPEN_ROOT_SETTINGS',
      name: 'Open root settings',
      type: PermissionType.DEVICE_EVENT,
      description: 'Used to enable user to open device root settings.',
    },
  });

  const permission11: Permission = await prisma.permission.upsert({
    where: { key: 'CLOSE_ROOT_SETTINGS' },
    update: {},
    create: {
      key: 'CLOSE_ROOT_SETTINGS',
      name: 'Close root settings',
      type: PermissionType.DEVICE_EVENT,
      description: 'Used to enable user to close device root settings.',
    },
  });

  const permission12: Permission = await prisma.permission.upsert({
    where: { key: 'OPEN_SOUND_BOOSTER' },
    update: {},
    create: {
      key: 'OPEN_SOUND_BOOSTER',
      name: 'Open sound booster',
      type: PermissionType.DEVICE_EVENT,
      description: 'Used to enable user to open device sound booster.',
    },
  });

  const permission13: Permission = await prisma.permission.upsert({
    where: { key: 'CLOSE_SOUND_BOOSTER' },
    update: {},
    create: {
      key: 'CLOSE_SOUND_BOOSTER',
      name: 'Close sound booster',
      type: PermissionType.DEVICE_EVENT,
      description: 'Used to enable user to close device sound booster.',
    },
  });

  const permission14: Permission = await prisma.permission.upsert({
    where: { key: 'OPEN_DOOR' },
    update: {},
    create: {
      key: 'OPEN_DOOR',
      name: 'Open door',
      type: PermissionType.DEVICE_EVENT,
      description: 'Used to enable user to open door with device.',
    },
  });

  const permission15: Permission = await prisma.permission.upsert({
    where: { key: 'REBOOT' },
    update: {},
    create: {
      key: 'REBOOT',
      name: 'Reboot',
      type: PermissionType.DEVICE_EVENT,
      description: 'Used to enable user to reboot the device.',
    },
  });

  const permission16: Permission = await prisma.permission.upsert({
    where: { key: 'RESET' },
    update: {},
    create: {
      key: 'RESET',
      name: 'Reset',
      type: PermissionType.DEVICE_EVENT,
      description: 'Used to enable user to reset the device.',
    },
  });

  const permission17: Permission = await prisma.permission.upsert({
    where: { key: 'SHUTDOWN' },
    update: {},
    create: {
      key: 'SHUTDOWN',
      name: 'Shutdown',
      type: PermissionType.DEVICE_EVENT,
      description: 'Used to enable user to turn off the device.',
    },
  });

  const permission18: Permission = await prisma.permission.upsert({
    where: { key: 'CREATE_SITE' },
    update: {},
    create: {
      key: 'CREATE_SITE',
      name: 'Create site',
      type: PermissionType.SITE,
      description: 'Used to enable user to create site.',
    },
  });

  const permission19: Permission = await prisma.permission.upsert({
    where: { key: 'EDIT_SITE' },
    update: {},
    create: {
      key: 'EDIT_SITE',
      name: 'Edit site',
      type: PermissionType.SITE,
      description: 'Used to enable user to edit site.',
    },
  });

  const permission20: Permission = await prisma.permission.upsert({
    where: { key: 'DELETE_SITE' },
    update: {},
    create: {
      key: 'DELETE_SITE',
      name: 'Delete site',
      type: PermissionType.SITE,
      description: 'Used to enable user to delete site.',
    },
  });

  const permission21: Permission = await prisma.permission.upsert({
    where: { key: 'LIST_SITES' },
    update: {},
    create: {
      key: 'LIST_SITES',
      name: 'List sites',
      type: PermissionType.SITE,
      description: 'Used to enable user to list sites.',
    },
  });

  const permission22: Permission = await prisma.permission.upsert({
    where: { key: 'SITE_DETAILS' },
    update: {},
    create: {
      key: 'SITE_DETAILS',
      name: 'Site details',
      type: PermissionType.SITE,
      description: 'Used to enable user to view site details.',
    },
  });

  const permission23: Permission = await prisma.permission.upsert({
    where: { key: 'CREATE_USER' },
    update: {},
    create: {
      key: 'CREATE_USER',
      name: 'Create user',
      type: PermissionType.USER,
      description: 'Used to enable user to create user.',
    },
  });

  const permission24: Permission = await prisma.permission.upsert({
    where: { key: 'EDIT_USER' },
    update: {},
    create: {
      key: 'EDIT_USER',
      name: 'Edit user',
      type: PermissionType.USER,
      description: 'Used to enable user to edit user.',
    },
  });

  const permission25: Permission = await prisma.permission.upsert({
    where: { key: 'DELETE_USER' },
    update: {},
    create: {
      key: 'DELETE_USER',
      name: 'Delete user',
      type: PermissionType.USER,
      description: 'Used to enable user to delete user.',
    },
  });

  const permission26: Permission = await prisma.permission.upsert({
    where: { key: 'LIST_USERS' },
    update: {},
    create: {
      key: 'LIST_USERS',
      name: 'List users',
      type: PermissionType.USER,
      description: 'Used to enable user to list users.',
    },
  });

  const permission27: Permission = await prisma.permission.upsert({
    where: { key: 'USER_DETAILS' },
    update: {},
    create: {
      key: 'USER_DETAILS',
      name: 'User details',
      type: PermissionType.USER,
      description: 'Used to enable user to view user details.',
    },
  });

  const permission28: Permission = await prisma.permission.upsert({
    where: { key: 'CREATE_DEVICE' },
    update: {},
    create: {
      key: 'CREATE_DEVICE',
      name: 'Create device',
      type: PermissionType.DEVICE,
      description: 'Used to enable user to create device.',
    },
  });

  const permission29: Permission = await prisma.permission.upsert({
    where: { key: 'EDIT_DEVICE' },
    update: {},
    create: {
      key: 'EDIT_DEVICE',
      name: 'Edit device',
      type: PermissionType.DEVICE,
      description: 'Used to enable user to edit device.',
    },
  });

  const permission30: Permission = await prisma.permission.upsert({
    where: { key: 'DELETE_DEVICE' },
    update: {},
    create: {
      key: 'DELETE_DEVICE',
      name: 'Delete device',
      type: PermissionType.DEVICE,
      description: 'Used to enable user to delete device.',
    },
  });

  const permission31: Permission = await prisma.permission.upsert({
    where: { key: 'LIST_DEVICES' },
    update: {},
    create: {
      key: 'LIST_DEVICES',
      name: 'List devices',
      type: PermissionType.DEVICE,
      description: 'Used to enable user to list devices.',
    },
  });

  const permission32: Permission = await prisma.permission.upsert({
    where: { key: 'DEVICE_DETAILS' },
    update: {},
    create: {
      key: 'DEVICE_DETAILS',
      name: 'Device details',
      type: PermissionType.DEVICE,
      description: 'Used to enable user to view device details.',
    },
  });

  const permission33: Permission = await prisma.permission.upsert({
    where: { key: 'CREATE_ACCESS_KEY' },
    update: {},
    create: {
      key: 'CREATE_ACCESS_KEY',
      name: 'Create access key',
      type: PermissionType.ACCESS_KEY,
      description: 'Used to enable user to create access key.',
    },
  });

  const permission34: Permission = await prisma.permission.upsert({
    where: { key: 'EDIT_ACCESS_KEY' },
    update: {},
    create: {
      key: 'EDIT_ACCESS_KEY',
      name: 'Edit access key',
      type: PermissionType.ACCESS_KEY,
      description: 'Used to enable user to edit access key.',
    },
  });

  const permission35: Permission = await prisma.permission.upsert({
    where: { key: 'DELETE_ACCESS_KEY' },
    update: {},
    create: {
      key: 'DELETE_ACCESS_KEY',
      name: 'Delete access key',
      type: PermissionType.ACCESS_KEY,
      description: 'Used to enable user to delete access key.',
    },
  });

  const permission36: Permission = await prisma.permission.upsert({
    where: { key: 'LIST_ACCESS_KEYS' },
    update: {},
    create: {
      key: 'LIST_ACCESS_KEYS',
      name: 'List access keys',
      type: PermissionType.ACCESS_KEY,
      description: 'Used to enable user to list access keys.',
    },
  });

  const permission37: Permission = await prisma.permission.upsert({
    where: { key: 'ACCESS_KEY_DETAILS' },
    update: {},
    create: {
      key: 'ACCESS_KEY_DETAILS',
      name: 'Access key details',
      type: PermissionType.ACCESS_KEY,
      description: 'Used to enable user to view access key details.',
    },
  });

  const permission38: Permission = await prisma.permission.upsert({
    where: { key: 'CREATE_ACCESS_GROUP' },
    update: {},
    create: {
      key: 'CREATE_ACCESS_GROUP',
      name: 'Create access group',
      type: PermissionType.ACCESS_GROUP,
      description: 'Used to enable user to create access group.',
    },
  });

  const permission39: Permission = await prisma.permission.upsert({
    where: { key: 'EDIT_ACCESS_GROUP' },
    update: {},
    create: {
      key: 'EDIT_ACCESS_GROUP',
      name: 'Edit access group',
      type: PermissionType.ACCESS_GROUP,
      description: 'Used to enable user to edit access group.',
    },
  });

  const permission40: Permission = await prisma.permission.upsert({
    where: { key: 'DELETE_ACCESS_GROUP' },
    update: {},
    create: {
      key: 'DELETE_ACCESS_GROUP',
      name: 'Delete access group',
      type: PermissionType.ACCESS_GROUP,
      description: 'Used to enable user to delete access group.',
    },
  });

  const permission41: Permission = await prisma.permission.upsert({
    where: { key: 'LIST_ACCESS_GROUPS' },
    update: {},
    create: {
      key: 'LIST_ACCESS_GROUPS',
      name: 'List access groups',
      type: PermissionType.ACCESS_GROUP,
      description: 'Used to enable user to list access groups.',
    },
  });

  const permission42: Permission = await prisma.permission.upsert({
    where: { key: 'ACCESS_GROUP_DETAILS' },
    update: {},
    create: {
      key: 'ACCESS_GROUP_DETAILS',
      name: 'Access group details',
      type: PermissionType.ACCESS_GROUP,
      description: 'Used to enable user to view access group details.',
    },
  });

  const permission43: Permission = await prisma.permission.upsert({
    where: { key: 'LIST_EVENTS' },
    update: {},
    create: {
      key: 'LIST_EVENTS',
      name: 'List events',
      type: PermissionType.EVENT,
      description: 'Used to enable user to list events.',
    },
  });

  const permission44: Permission = await prisma.permission.upsert({
    where: { key: 'CREATE_ROLE' },
    update: {},
    create: {
      key: 'CREATE_ROLE',
      name: 'Create role',
      type: PermissionType.ADMIN_AND_ROLE,
      description: 'Used to enable user to create role.',
    },
  });

  const permission45: Permission = await prisma.permission.upsert({
    where: { key: 'EDIT_ROLE' },
    update: {},
    create: {
      key: 'EDIT_ROLE',
      name: 'Edit role',
      type: PermissionType.ADMIN_AND_ROLE,
      description: 'Used to enable user to edit role.',
    },
  });

  const permission46: Permission = await prisma.permission.upsert({
    where: { key: 'DELETE_ROLE' },
    update: {},
    create: {
      key: 'DELETE_ROLE',
      name: 'Delete role',
      type: PermissionType.ADMIN_AND_ROLE,
      description: 'Used to enable user to delete role.',
    },
  });

  const permission47: Permission = await prisma.permission.upsert({
    where: { key: 'ATTACH_PERMISSIONS_TO_ROLE' },
    update: {},
    create: {
      key: 'ATTACH_PERMISSIONS_TO_ROLE',
      name: 'Attach permissions to role',
      type: PermissionType.ADMIN_AND_ROLE,
      description: 'Used to enable user to attach permissions to role.',
    },
  });

  const permission48: Permission = await prisma.permission.upsert({
    where: { key: 'INVITE_AND_MANAGE_ADMINS' },
    update: {},
    create: {
      key: 'INVITE_AND_MANAGE_ADMINS',
      name: 'Invite and manage admins',
      type: PermissionType.ADMIN_AND_ROLE,
      description: 'Used to enable user to invite and manage admins.',
    },
  });

  const permission49: Permission = await prisma.permission.upsert({
    where: { key: 'ENABLE_VOICE' },
    update: {},
    create: {
      key: 'ENABLE_VOICE',
      name: 'Voice permission',
      type: PermissionType.CALL,
      description: 'Used to enable user voice during the call.',
    },
  });

  const permission50: Permission = await prisma.permission.upsert({
    where: { key: 'ENABLE_VIDEO' },
    update: {},
    create: {
      key: 'ENABLE_VIDEO',
      name: 'Video permission',
      type: PermissionType.CALL,
      description: 'Used to enable user video during the call.',
    },
  });

  logger.verbose('Permissions created successfully');

  return [
    permission1,
    permission2,
    permission3,
    permission4,
    permission5,
    permission6,
    permission7,
    permission8,
    permission9,
    permission10,
    permission11,
    permission12,
    permission13,
    permission14,
    permission15,
    permission16,
    permission17,
    permission18,
    permission19,
    permission20,
    permission21,
    permission22,
    permission23,
    permission24,
    permission25,
    permission26,
    permission27,
    permission28,
    permission29,
    permission30,
    permission31,
    permission32,
    permission33,
    permission34,
    permission35,
    permission36,
    permission37,
    permission38,
    permission39,
    permission40,
    permission41,
    permission42,
    permission43,
    permission44,
    permission45,
    permission46,
    permission47,
    permission48,
    permission49,
    permission50,
  ];
};

export default { createPermissions };
