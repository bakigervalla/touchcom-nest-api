import { Logger } from '@nestjs/common';
import {
  PrismaClient,
  Configuration,
  Version,
  Device,
  Site,
  DeviceStatus,
} from '@prisma/client';

const prisma = new PrismaClient();

const createDevices = async (
  configuration: Configuration,
  version: Version,
  sites: Site[],
): Promise<Device[]> => {
  const logger = new Logger('Seed');

  logger.verbose('Creating dummy devices...');

  const device1: Device = await prisma.device.upsert({
    where: { serialNumber: 'c3d9b8674f4b94f6' },
    update: {},
    create: {
      serialNumber: 'c3d9b8674f4b94f6',
      name: 'Device 1',
      description: 'Device 1 description',
      configurationId: configuration.id,
      versionId: version.id,
      status: DeviceStatus.ACTIVE,
      imageUrl: 'https://picsum.photos/200/300.jpg',
      siteId: sites[0].id,
    },
  });

  const device2: Device = await prisma.device.upsert({
    where: { serialNumber: '5489b8674f4b94f6' },
    update: {},
    create: {
      serialNumber: '5489b8674f4b94f6',
      name: 'Device 2',
      description: 'Device 2 description',
      configurationId: configuration.id,
      versionId: version.id,
      status: DeviceStatus.INACTIVE,
      imageUrl: 'https://picsum.photos/200/300/?blur=2',
      siteId: sites[0].id,
    },
  });

  const device3: Device = await prisma.device.upsert({
    where: { serialNumber: '548587674f4b94f6' },
    update: {},
    create: {
      serialNumber: '548587674f4b94f6',
      name: 'Device 3',
      description: 'Device 3 description',
      configurationId: configuration.id,
      versionId: version.id,
      status: DeviceStatus.ACTIVE,
      imageUrl: 'https://picsum.photos/200/300/?blur=2',
      siteId: sites[1].id,
    },
  });

  logger.verbose(
    'Dummy devices created: ',
    [device1.name, device2.name, device3.name].join(', '),
  );

  return [device1, device2, device3];
};

export default { createDevices };
