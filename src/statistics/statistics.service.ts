import { Injectable } from '@nestjs/common';
import { DeviceStatus, DeviceType } from '@prisma/client';

import { PrismaService } from '@~prisma/prisma.service';
import { UserDto } from '@users/dto';

import {
  DeviceInfo,
  DeviceTypeStatistics,
  StatisticsDto,
  VisitorsFilter,
} from './dto';

@Injectable()
export class StatisticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getStatistics(
    user: UserDto,
    _visitorsFilter?: VisitorsFilter,
  ): Promise<StatisticsDto> {
    const activeDevicesInfo = await this.getDeviceInfo(
      user,
      DeviceStatus.ACTIVE,
    );
    const inactiveDevicesInfo = await this.getDeviceInfo(
      user,
      DeviceStatus.INACTIVE,
    );
    const inReviewDevicesInfo = await this.getDeviceInfo(
      user,
      DeviceStatus.REGISTRATION_IN_REVIEW,
    );

    return {
      events: [],
      visitors: [],
      devicesInfo: [
        activeDevicesInfo,
        inactiveDevicesInfo,
        inReviewDevicesInfo,
      ],
    };
  }

  private async getDeviceInfo(
    user: UserDto,
    status: DeviceStatus,
  ): Promise<DeviceInfo> {
    const totalDevicesByStatus = await this.prisma.device.count({
      where: { status, siteId: user.activeSite.id },
    });

    const deviceTypeStatistics = [] as DeviceTypeStatistics[];
    for (const type of Object.values(DeviceType)) {
      const totalDevicesByType = await this.prisma.device.count({
        where: {
          status,
          type,
          siteId: user.activeSite.id,
        },
      });
      deviceTypeStatistics.push({ total: totalDevicesByType, type });
    }

    return {
      total: totalDevicesByStatus,
      status,
      deviceTypeStatistics,
    };
  }
}
