import { DeviceType, DeviceStatus } from '@prisma/client';

export class DeviceTypeStatistics {
  total: number;
  type: DeviceType;
}

export class DeviceInfo {
  total: number;
  status: DeviceStatus;
  deviceTypeStatistics: DeviceTypeStatistics[];
}
