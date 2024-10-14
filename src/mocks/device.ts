import { DeviceStatus } from '@prisma/client';

import { DeviceEntity } from '@devices/entities';

const testDevices: Partial<DeviceEntity>[] = [
  {
    id: 1,
    serialNumber: '83BD963997E9410A9150F97E8A174B1E',
    name: 'Device 1',
    description: 'Device 1 description',
    status: DeviceStatus.ACTIVE,
    configurationId: 1,
    versionId: 1,
    siteId: 1,
    imageUrl: 'https://picsum.photos/200/300.jpg',
    twilioRoomName: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    serialNumber: '83BD963997E9420A9250F97E8A274B2E',
    name: 'Device 2',
    description: 'Device 2 description',
    status: DeviceStatus.ERROR,
    configurationId: 1,
    versionId: 1,
    siteId: 1,
    imageUrl: 'https://picsum.photos/200/300/?blur=2',
    twilioRoomName: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    serialNumber: '83BD963997E9430A9350F97E8A374B3E',
    name: 'Device 3',
    description: 'Device 3 description',
    status: DeviceStatus.OFF,
    configurationId: 1,
    versionId: 1,
    siteId: 1,
    imageUrl: '',
    twilioRoomName: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default { testDevices };
