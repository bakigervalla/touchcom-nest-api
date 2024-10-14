import { ConfigService } from '@nestjs/config';
import { Injectable, BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  AccessControl,
  AccessControlStatus,
  AccessExceptionStatus,
  AccessGroup,
  AccessGroupStatus,
  AccessKey,
  AccessKeyStatus,
  Device,
  DeviceStatus,
  LockStatus,
} from '@prisma/client';

import { DeviceAccess, PublicErrors } from '@common/types';
import { DeviceDto } from '@devices/dto';
import { PrismaService } from '@~prisma/prisma.service';
import { UserDto } from '@users/dto';

import common from '@common/utils/common';
import { DAYS, DEVICE } from '@common/utils/constants';
import { SecurityConfig } from '@common/configs/config.interface';

import { AccessControlDto } from './dto';
import { AccessGroupDto, AccessExceptionDto } from '@src/access-groups/dto';

@Injectable()
export class AccessControlService {
  private readonly securityConfig: SecurityConfig;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.securityConfig = this.configService.get<SecurityConfig>('security');
  }

  async getUserDeviceAccesses(userId: number): Promise<AccessControlDto[]> {
    return this.prisma.accessControl.findMany({
      where: { userId },
      include: { device: true },
    });
  }

  async getUserDeviceAccess(
    userId: number,
    deviceId: number,
  ): Promise<
    AccessControl & {
      device: Device;
      accessKey: AccessKey;
      accessGroup: AccessGroup;
    }
  > {
    return this.prisma.accessControl.findFirst({
      where: { deviceId: deviceId, userId: userId },
      include: { device: true, accessKey: true, accessGroup: true },
    });
  }

  async getActiveUserDeviceAccess(
    userId: number,
    serialNumber?: string,
  ): Promise<AccessControlDto> {
    return this.prisma.accessControl.findFirst({
      where: {
        userId: userId,
        ...(serialNumber ? { device: { serialNumber } } : {}),
        status: AccessControlStatus.ACTIVE,
      },
      include: { device: true },
    });
  }

  async getInReviewUserDeviceAccess(userId: number): Promise<AccessControlDto> {
    return this.prisma.accessControl.findFirst({
      where: {
        userId: userId,
        status: AccessControlStatus.PENDING,
        device: { status: DeviceStatus.REGISTRATION_IN_REVIEW },
      },
      include: { device: true },
    });
  }

  async checkIfUserHasDeviceAccessInReview(user: UserDto): Promise<void> {
    if (!user) {
      return;
    }

    const deviceInReview = await this.getInReviewUserDeviceAccess(user.id);
    if (deviceInReview) {
      throw new BadRequestException({
        code: PublicErrors.USER_DEVICE_IN_REVIEW_QUOTA_REACHED,
        message: 'User already has other device in review state',
      });
    }
  }

  async getUserNotAllocatedInactiveDevice(
    user: UserDto,
    serialNumber: string,
  ): Promise<DeviceDto> {
    if (!user) {
      throw new BadRequestException({
        code: PublicErrors.USER_DEVICE_ACCESS_FORBIDDEN,
        message: "User doesn't have access to the device",
      });
    }

    const userDevice = await this.prisma.accessControl.findFirst({
      where: {
        userId: user.id,
        device: { serialNumber },
      },
      include: { device: true },
    });

    if (userDevice && userDevice.status === DeviceStatus.ACTIVE) {
      return userDevice.device;
    }

    const userNotAllocatedInactiveDevice =
      await this.prisma.accessControl.findFirst({
        where: {
          userId: user.id,
          device: {
            status: DeviceStatus.INACTIVE,
            serialNumber: { contains: DEVICE.DUMMY_SERIAL_NUMBER_CHARACTER },
          },
        },
        include: { device: true },
      });

    if (!userNotAllocatedInactiveDevice) {
      throw new BadRequestException({
        code: PublicErrors.USER_DEVICE_ALLOCATION_FORBIDDEN,
        message: 'Can not allocate device to requested user',
      });
    }

    const activeDevice = await this.prisma.device.findFirst({
      where: { serialNumber },
    });

    // disable active device access
    await this.prisma.accessControl.updateMany({
      where: { deviceId: activeDevice.id },
      data: { status: AccessControlStatus.BLOCKED },
    });

    // enable access to not allocated device
    await this.prisma.accessControl.updateMany({
      where: { deviceId: userNotAllocatedInactiveDevice.device.id },
      data: { status: AccessControlStatus.ACTIVE },
    });

    // un-allocate active device
    await this.prisma.device.update({
      where: { serialNumber },
      data: { serialNumber: randomUUID(), status: DeviceStatus.INACTIVE },
    });

    // allocate new device
    const device = await this.prisma.device.update({
      where: { id: userNotAllocatedInactiveDevice.device.id },
      data: { serialNumber, status: DeviceStatus.ACTIVE },
    });

    return device;
  }

  async connectUserWithDevice(
    userId: number,
    deviceId: number,
    isVisible: boolean,
  ): Promise<void> {
    await this.prisma.accessControl.create({
      data: {
        deviceId: deviceId,
        userId: userId,
        status: AccessControlStatus.PENDING,
        isVisible,
      },
    });
  }

  async validateUserDeviceAccess(
    userId: number,
    deviceId: number,
    deviceAccess: DeviceAccess,
  ): Promise<void> {
    const userDeviceAccess = await this.getUserDeviceAccess(userId, deviceId);

    if (!userDeviceAccess) {
      throw new BadRequestException({
        code: PublicErrors.USER_DEVICE_ACCESS_FORBIDDEN,
        message: "User doesn't have access to the device",
      });
    }

    if (
      userDeviceAccess.device.status === DeviceStatus.REGISTRATION_IN_REVIEW ||
      userDeviceAccess.status === AccessControlStatus.PENDING
    ) {
      throw new BadRequestException({
        code: PublicErrors.USER_DEVICE_ACCESS_IN_REVIEW,
        message: 'User device access validation is still in process',
      });
    }

    if (userDeviceAccess.device.status !== DeviceStatus.ACTIVE) {
      throw new BadRequestException({
        code: PublicErrors.USER_DEVICE_ACCESS_UNAVAILABLE,
        message:
          'User device access is not available. Device is off or offline',
      });
    }

    if (userDeviceAccess.status === AccessControlStatus.BLOCKED) {
      throw new BadRequestException({
        code: PublicErrors.USER_DEVICE_ACCESS_BLOCKED,
        message: `User device access is blocked`,
      });
    }

    if (deviceAccess === DeviceAccess.PASSWORD) {
      await this.validateDevicePasswordAccess(userDeviceAccess);
    }

    if (deviceAccess === DeviceAccess.ACCESS_KEY) {
      await this.validateDeviceAccessKeyAccess(userDeviceAccess);
    }

    if (userDeviceAccess.failedAccessAttempts > 0) {
      await this.prisma.accessControl.update({
        where: { id: userDeviceAccess.id },
        data: { failedAccessAttempts: 0 },
      });
    }
  }

  private async validateDevicePasswordAccess(
    userDeviceAccess: AccessControl & {
      accessKey: AccessKey;
      accessGroup: AccessGroup;
    },
  ) {
    if (!userDeviceAccess.accessGroup) {
      return;
    }

    if (userDeviceAccess.accessGroup.status !== AccessGroupStatus.ACTIVE) {
      return;
    }

    const isAccessToDeviceAllowed = this.checkIfAccessToDeviceIsAllowed(
      userDeviceAccess.accessGroup,
    );

    if (!isAccessToDeviceAllowed) {
      await this.failUserDeviceAccess(
        userDeviceAccess,
        PublicErrors.GROUP_DEVICE_ACCESS_FORBIDDEN,
        `Access to device is blocked by access group ${userDeviceAccess.accessGroup.name}`,
        'accessControl',
      );
    }
  }

  private async validateDeviceAccessKeyAccess(
    userDeviceAccess: AccessControl & { accessKey: AccessKey },
  ) {
    if (!userDeviceAccess.accessKey) {
      await this.failUserDeviceAccess(
        userDeviceAccess,
        PublicErrors.ACCESS_KEY_INVALID,
        `Access key is not valid`,
        'accessControl',
      );
    }

    if (userDeviceAccess.accessKey.status !== AccessKeyStatus.ACTIVE) {
      throw new BadRequestException({
        code: PublicErrors.ACCESS_KEY_ACCESS_BLOCKED,
        message: `Access key device access is blocked`,
      });
    }

    const accessKeyHasDeviceAccess = common.validatePeriodAccess(
      userDeviceAccess.accessKey.validFrom,
      userDeviceAccess.accessKey.validTo,
    );

    if (!accessKeyHasDeviceAccess) {
      await this.failUserDeviceAccess(
        userDeviceAccess.accessKey,
        PublicErrors.ACCESS_KEY_ACCESS_TIMEOUT,
        `Access outside permitted period is not allowed`,
        'accessKey',
      );
    }
  }

  private checkIfAccessToDeviceIsAllowed(accessGroup: AccessGroupDto): boolean {
    if (!accessGroup.accessTimeSchedule) {
      return true;
    }

    const isAccessAllowedThroughException =
      this.checkIfAccessIsAllowedThroughException(accessGroup.accessExceptions);
    if (isAccessAllowedThroughException) {
      return true;
    }

    const currentTime = new Date();
    if (accessGroup.accessTimeSchedule.applyEveryDay) {
      return true;
    }

    if (
      (accessGroup.accessTimeSchedule.applyWholeMonday &&
        currentTime.getDay() === 1) ||
      (accessGroup.accessTimeSchedule.applyWholeTuesday &&
        currentTime.getDay() === 2) ||
      (accessGroup.accessTimeSchedule.applyWholeWednesday &&
        currentTime.getDay() === 3) ||
      (accessGroup.accessTimeSchedule.applyWholeThursday &&
        currentTime.getDay() === 4) ||
      (accessGroup.accessTimeSchedule.applyWholeFriday &&
        currentTime.getDay() === 5) ||
      (accessGroup.accessTimeSchedule.applyWholeSaturday &&
        currentTime.getDay() === 6) ||
      (accessGroup.accessTimeSchedule.applyWholeSunday &&
        currentTime.getDay() === 0)
    ) {
      return true;
    }

    for (const allowedAccessTimes of accessGroup.accessTimeSchedule
      .accessTimes) {
      const { day, accessTime } = allowedAccessTimes;
      if (
        DAYS.indexOf(day) === currentTime.getDay() &&
        currentTime.getUTCHours() >= parseInt(accessTime.accessStartsAt, 10) &&
        currentTime.getUTCHours() <= parseInt(accessTime.accessEndsAt, 10)
      ) {
        return true;
      }
    }

    return false;
  }

  private checkIfAccessIsAllowedThroughException(
    accessExceptions: AccessExceptionDto[],
  ) {
    if (!accessExceptions || accessExceptions.length <= 0) {
      return false;
    }

    const currentTime = new Date();
    for (const accessException of accessExceptions) {
      if (accessException.status !== AccessExceptionStatus.ACTIVE) {
        continue;
      }

      if (
        accessException.applySingleDate &&
        currentTime >= accessException.startDate &&
        accessException.applyWholeDay
      ) {
        return accessException.lockStatus === LockStatus.OPEN;
      }

      if (
        accessException.applySingleDate &&
        currentTime >= accessException.startDate &&
        currentTime.getUTCHours() >= parseInt(accessException.startTime, 10) &&
        currentTime.getUTCHours() <= parseInt(accessException.endTime, 10)
      ) {
        return accessException.lockStatus === LockStatus.OPEN;
      }

      if (
        currentTime >= accessException.startDate &&
        currentTime <= accessException.endDate &&
        accessException.applyWholeDay
      ) {
        return accessException.lockStatus === LockStatus.OPEN;
      }

      if (
        currentTime >= accessException.startDate &&
        currentTime <= accessException.endDate &&
        currentTime.getUTCHours() >= parseInt(accessException.startTime, 10) &&
        currentTime.getUTCHours() <= parseInt(accessException.endTime, 10)
      ) {
        return accessException.lockStatus === LockStatus.OPEN;
      }
    }

    return false;
  }

  private async failUserDeviceAccess(
    userDeviceAccess: AccessControl | AccessKey,
    code: number,
    message: string,
    prismaEntity: string,
  ): Promise<void> {
    const failedAccessAttempts = userDeviceAccess.failedAccessAttempts + 1;
    const status =
      failedAccessAttempts >= this.securityConfig.allowedLoginAttempts
        ? AccessControlStatus.BLOCKED
        : userDeviceAccess.status;

    await this.prisma[prismaEntity].update({
      where: { id: userDeviceAccess.id },
      data: { failedAccessAttempts, status },
    });

    throw new BadRequestException({
      code,
      message,
    });
  }
}
