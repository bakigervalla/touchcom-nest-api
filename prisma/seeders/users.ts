import * as bcrypt from 'bcrypt';
import { Logger } from '@nestjs/common';
import {
  PrismaClient,
  Role,
  Site,
  User,
  UserSite,
  UserStatus,
  UserType,
} from '@prisma/client';

const prisma = new PrismaClient();

const createUsers = async (
  roles: Role[],
): Promise<(User & { sites: UserSite[] })[]> => {
  const logger = new Logger('Seed');

  logger.verbose('Creating dummy users...');

  const company = await prisma.user.upsert({
    where: { email: 'company@touchcom.com' },
    update: {},
    create: {
      email: 'company@touchcom.com',
      password: await bcrypt.hash('company', 8),
      name: 'Company AS',
      type: UserType.COMPANY,
      floor: 2,
      phone: '+23423423',
      imageUrl:
        'https://gravatar.com/avatar/4849ac5d9be27f2af62daff7fafe6987?s=200&d=mp&r=x',
      status: UserStatus.ACTIVE,
      roleId: roles[1].id,
    },
    include: { sites: true },
  });

  const resident1 = await prisma.user.upsert({
    where: { email: 'resident1@touchcom.com' },
    update: {},
    create: {
      email: 'resident1@touchcom.com',
      password: await bcrypt.hash('resident1', 8),
      firstName: 'resident1 name',
      lastName: 'resident1 last name',
      phone: '+23423423',
      type: UserType.RESIDENT,
      imageUrl:
        'https://gravatar.com/avatar/b31199296ce82904d5e9fb934838d9b9?s=400&d=robohash&r=x',
      status: UserStatus.ACTIVE,
      roleId: roles[0].id,
      companyId: company.id,
    },
    include: { sites: true },
  });

  const resident2 = await prisma.user.upsert({
    where: { email: 'resident2@touchcom.com' },
    update: {},
    create: {
      email: 'resident2@touchcom.com',
      password: await bcrypt.hash('resident2', 8),
      firstName: 'resident2 name',
      lastName: 'resident2 last name',
      phone: '+23423423',
      type: UserType.RESIDENT,
      imageUrl:
        'https://gravatar.com/avatar/c9d1a4f55647f9615cfc7390647e9f2d?s=400&d=robohash&r=x',
      status: UserStatus.ACTIVE,
      roleId: roles[0].id,
      companyId: company.id,
    },
    include: { sites: true },
  });

  const testForgotPassword = await prisma.user.upsert({
    where: { email: 'bakige@gmail.com' },
    update: {},
    create: {
      email: 'bakige@gmail.com',
      password: await bcrypt.hash('bakige', 8),
      firstName: 'baki',
      lastName: 'baki ge',
      phone: '+38344287715',
      type: UserType.RESIDENT,
      status: UserStatus.ACTIVE,
      roleId: roles[2].id,
      companyId: company.id,
    },
    include: { sites: true },
  });

  const touchcomDeveloper = await prisma.user.upsert({
    where: { email: 'dev@touchcom.no' },
    update: {},
    create: {
      email: 'dev@touchcom.no',
      password: await bcrypt.hash('touchcom_dev', 8),
      firstName: 'Touchcom',
      lastName: 'Developer',
      phone: '+4755555555',
      type: UserType.RESIDENT,
      status: UserStatus.ACTIVE,
      roleId: roles[2].id,
      companyId: company.id,
    },
    include: { sites: true },
  });

  const installer = await prisma.user.upsert({
    where: { email: 'installer@touchcom.no' },
    update: {},
    create: {
      email: 'installer@touchcom.no',
      password: await bcrypt.hash('installer', 8),
      firstName: 'Installer',
      lastName: 'Touchcom',
      phone: '+4755555555',
      type: UserType.RESIDENT,
      status: UserStatus.ACTIVE,
      roleId: roles[3].id,
      companyId: company.id,
    },
    include: { sites: true },
  });

  const apartment = await prisma.user.upsert({
    where: { email: 'apartment@touchcom.com' },
    update: {},
    create: {
      email: 'apartment@touchcom.com',
      password: await bcrypt.hash('apartment', 8),
      name: 'Apartment',
      floor: 3,
      number: '25a',
      type: UserType.APARTMENT,
      phone: '+23423423',
      imageUrl:
        'https://gravatar.com/avatar/4849ac5d9be27f2af62daff7fafe6987?s=200&d=mp&r=x',
      status: UserStatus.ACTIVE,
      roleId: roles[1].id,
    },
    include: { sites: true },
  });

  const tenant1 = await prisma.user.upsert({
    where: { email: 'tenant1@touchcom.com' },
    update: {},
    create: {
      email: 'tenant1@touchcom.com',
      password: await bcrypt.hash('tenant1', 8),
      firstName: 'tenant1 name',
      lastName: 'tenant1 last name',
      phone: '+23423423',
      type: UserType.RESIDENT,
      imageUrl:
        'https://gravatar.com/avatar/c9d1a4f55647f9615cfc7390647e9f2d?s=400&d=robohash&r=x',
      status: UserStatus.ACTIVE,
      roleId: roles[0].id,
      apartmentId: apartment.id,
    },
    include: { sites: true },
  });

  logger.verbose(
    'Dummy users created: ',
    [
      company.email,
      apartment.email,
      tenant1.email,
      resident1.email,
      resident2.email,
      testForgotPassword.email,
      touchcomDeveloper.email,
      installer.email,
    ].join(', '),
  );

  return [
    company,
    resident1,
    resident2,
    testForgotPassword,
    touchcomDeveloper,
    installer,
    apartment,
    tenant1,
  ];
};

const connectUsersToSite = async (users: User[], site: Site) => {
  users.forEach(async (user: User) => {
    await prisma.userSite.upsert({
      where: { userId_siteId: { userId: user.id, siteId: site.id } },
      update: {},
      create: {
        userId: user.id,
        siteId: site.id,
      },
    });
  });
};

export default { createUsers, connectUsersToSite };
