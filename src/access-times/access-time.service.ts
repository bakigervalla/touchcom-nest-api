import { AccessTime, TimeScheduleAccessTime } from '@prisma/client';
import { BadRequestException, Injectable } from '@nestjs/common';

import { AccessTimeScheduleDto } from '@common/dto';
import { PrismaService } from '@~prisma/prisma.service';
import { PublicErrors } from '@common/types';

@Injectable()
export class AccessTimeService {
  constructor(private readonly prisma: PrismaService) {}

  async processAccessTimes(
    payload: Partial<TimeScheduleAccessTime & { accessTime: AccessTime }>[],
    upsertedAccessTimeSchedule: AccessTimeScheduleDto,
  ) {
    const accessTimes = [];
    for (const timeScheduleAccessTime of payload) {
      const { accessTime, day } = timeScheduleAccessTime;
      let { timeScheduleId } = timeScheduleAccessTime;

      if (!timeScheduleId) {
        timeScheduleId = upsertedAccessTimeSchedule.id;
      }

      const existingTimeScheduleAccessTimes =
        await this.prisma.timeScheduleAccessTime.findMany({
          where: { timeScheduleId, day },
          include: { accessTime: true },
        });

      if (
        this.doAccessTimesOverlap(existingTimeScheduleAccessTimes, accessTime)
      ) {
        throw new BadRequestException({
          code: PublicErrors.ACCESS_GROUP_TIME_OVERLAP,
          message:
            "Can't grant access during selected times. Overlap encountered.",
        });
      }

      const createdAccessTime = await this.prisma.accessTime.create({
        data: accessTime,
      });

      const createdTimeScheduleAccessTime =
        await this.prisma.timeScheduleAccessTime.create({
          data: { timeScheduleId, accessTimeId: createdAccessTime.id, day },
          include: { accessTime: true },
        });

      accessTimes.push(createdTimeScheduleAccessTime);
    }

    return accessTimes;
  }

  private doAccessTimesOverlap(
    existingTimeScheduleAccessTimes: Partial<
      TimeScheduleAccessTime & { accessTime: AccessTime }
    >[],
    newAccessTime: AccessTime,
  ): boolean {
    const doAccessTimesOverlap = existingTimeScheduleAccessTimes.some(
      (existingTimeScheduleAccessTime) => {
        const { accessStartsAt, accessEndsAt } =
          existingTimeScheduleAccessTime.accessTime;

        const isOverlap = !(
          parseInt(accessEndsAt, 10) <=
            parseInt(newAccessTime.accessStartsAt) ||
          parseInt(accessStartsAt, 10) >=
            parseInt(newAccessTime.accessEndsAt, 10)
        );

        return isOverlap;
      },
    );

    return doAccessTimesOverlap;
  }
}
