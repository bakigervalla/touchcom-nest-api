import { LockStatus } from '@prisma/client';

export class Heartbeat {
  deviceId: number;
  lockStatus: LockStatus;
}
