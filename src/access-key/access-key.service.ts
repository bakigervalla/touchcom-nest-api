import { AccessKeyStatus, AccessTime } from '@prisma/client';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CrudQueryObj, PrismaCrudService } from 'nestjs-prisma-crud';
import { omit as _omit } from 'lodash';

import { AccessKeyProviderService } from '@access-key-provider/access-key-provider.service';
import { AccessTimeScheduleDto } from '@common/dto';
import { AccessTimeService } from '@access-times/access-time.service';
import { Pagination } from '@common/entities';
import { PrismaService } from '@~prisma/prisma.service';
import { PublicErrors } from '@common/types';
import { UserDto } from '@users/dto';

import { AccessKeyDto, AccessKeysOverviewDto } from './dto';

@Injectable()
export class AccessKeyService {
  private readonly prismaCrud: PrismaCrudService;

  constructor(
    private readonly prisma: PrismaService,
    private readonly accessTimesService: AccessTimeService,
    private readonly accessKeyProviderService: AccessKeyProviderService,
  ) {
    this.prismaCrud = new PrismaCrudService({
      model: 'accessKey',
      allowedJoins: [
        'accessKeyProvider',
        'accessControl',
        'accessControl.user',
        'accessControl.device',
        'accessTimeSchedule',
        'accessTimeSchedule.accessTimes',
        'accessTimeSchedule.accessTimes.accessTime',
      ],
    });
  }

  async upsert(payload: AccessKeyDto, user: UserDto): Promise<AccessKeyDto> {
    const keyProvider = await this.prisma.accessKeyProvider.findFirst();
    const accessKeyProvider = await this.accessKeyProviderService.upsert(
      payload?.accessKeyProvider ?? keyProvider,
    );

    if (!('id' in payload) && payload.tag) {
      const existingAccessKey = await this.prisma.accessKey.findFirst({
        where: { tag: payload.tag },
      });
      if (existingAccessKey) {
        throw new BadRequestException({
          code: PublicErrors.ACTION_DENIED,
          message: "Can't execute requested operation",
        });
      }
    }

    const accessKey = _omit(payload, [
      'site',
      'accessControl',
      'accessKeyProvider',
      'accessTimeSchedule',
    ]);
    return this.prisma.accessKey.upsert({
      create: {
        ...accessKey,
        siteId: user.activeSite.id,
        accessKeyProviderId: accessKeyProvider.id,
      },
      update: {
        ...accessKey,
        siteId: user.activeSite.id,
        accessKeyProviderId: accessKeyProvider.id,
      },
      where: { id: payload?.id ?? 0 },
      include: { accessKeyProvider: true },
    });
  }

  async getAccessKeys(
    crudQuery: string,
    user: UserDto,
  ): Promise<Pagination<AccessKeyDto>> {
    const parsedQuery: CrudQueryObj = JSON.parse(crudQuery);
    const accessKeys: Pagination<AccessKeyDto> = await this.prismaCrud.findMany(
      {
        crudQuery: {
          ...parsedQuery,
          where: { ...parsedQuery.where, siteId: user.activeSite.id },
        },
      },
    );

    return accessKeys;
  }

  async getAccessKey(
    id: number,
    crudQuery: string,
    user: UserDto,
  ): Promise<AccessKeyDto> {
    const parsedQuery: CrudQueryObj = JSON.parse(crudQuery);
    const accessKey: AccessKeyDto = await this.prismaCrud.findOne(id, {
      crudQuery: {
        ...parsedQuery,
        where: { ...parsedQuery.where, siteId: user.activeSite.id },
      },
    });

    return accessKey;
  }

  async syncAccessKeys(crudQuery: string): Promise<Pagination<AccessKeyDto>> {
    const parsedQuery: CrudQueryObj = JSON.parse(crudQuery);
    const accessKeys: Pagination<AccessKeyDto> = await this.prismaCrud.findMany(
      {
        crudQuery: parsedQuery,
      },
    );

    return accessKeys;
  }

  async upsertTimeSchedule(
    accessKeyId: number,
    payload: AccessTimeScheduleDto,
    user: UserDto,
  ): Promise<AccessTimeScheduleDto> {
    const payloadId = payload.id;
    const accessKey = await this.prisma.accessKey.findFirst({
      where: { id: accessKeyId, siteId: user.activeSite.id },
      include: {
        accessTimeSchedule: {
          include: { accessTimes: { include: { accessTime: true } } },
        },
      },
    });

    if (!accessKey) {
      throw new BadRequestException({
        code: PublicErrors.ACTION_DENIED,
        message: "Can't execute requested operation",
      });
    }

    const accessTimeSchedule = _omit(payload, [
      'id',
      'accessKeys',
      'accessTimes',
      'accessGroups',
    ]);
    const upsertedAccessTimeSchedule: AccessTimeScheduleDto =
      await this.prisma.accessTimeSchedule.upsert({
        create: accessTimeSchedule,
        update: accessTimeSchedule,
        where: { id: payloadId ?? 0 },
      });

    if (!payloadId) {
      await this.prisma.accessKey.update({
        where: {
          id: accessKey.id,
        },
        data: {
          accessTimeScheduleId: upsertedAccessTimeSchedule.id,
        },
      });
    }

    if (payload.accessTimes && payload.accessTimes.length) {
      const accessTimes = await this.accessTimesService.processAccessTimes(
        payload.accessTimes,
        upsertedAccessTimeSchedule,
      );
      upsertedAccessTimeSchedule.accessTimes = accessTimes;
    }

    return upsertedAccessTimeSchedule;
  }

  async getTimeSchedule(
    accessKeyId: number,
    user: UserDto,
  ): Promise<AccessTimeScheduleDto> {
    const accessKey = await this.prisma.accessKey.findFirst({
      where: { id: accessKeyId, siteId: user.activeSite.id },
      include: {
        accessTimeSchedule: {
          include: { accessTimes: { include: { accessTime: true } } },
        },
      },
    });

    if (!accessKey) {
      throw new BadRequestException({
        code: PublicErrors.ACTION_DENIED,
        message: "Can't execute requested operation",
      });
    }

    return accessKey.accessTimeSchedule;
  }

  async deleteTimeScheduleAccessTime(
    accessKeyId: number,
    timeScheduleId: number,
    accessTimeId: number,
    user: UserDto,
  ): Promise<AccessTime> {
    const accessKey = await this.prisma.accessKey.findFirst({
      where: {
        id: accessKeyId,
        accessTimeScheduleId: timeScheduleId,
        siteId: user.activeSite.id,
      },
    });

    if (!accessKey) {
      throw new BadRequestException({
        code: PublicErrors.ACTION_DENIED,
        message: "Can't execute requested operation",
      });
    }

    await this.prisma.timeScheduleAccessTime.delete({
      where: {
        timeScheduleId_accessTimeId: {
          timeScheduleId,
          accessTimeId,
        },
      },
    });

    const accessTime = await this.prisma.accessTime.delete({
      where: { id: accessTimeId },
    });

    return accessTime;
  }

  async getAccessKeysOverview(user: UserDto): Promise<AccessKeysOverviewDto> {
    const totalKeys = await this.getTotalAccessKeysByStatus(user);
    const activeKeys = await this.getTotalAccessKeysByStatus(
      user,
      AccessKeyStatus.ACTIVE,
    );
    const inactiveKeys = await this.getTotalAccessKeysByStatus(
      user,
      AccessKeyStatus.INACTIVE,
    );

    const accessKeysOverview = { totalKeys, activeKeys, inactiveKeys };

    return accessKeysOverview;
  }

  async attachAccessKeyToUserAndDevice(
    accessKeyId: number,
    userId: number,
    deviceId: number,
    user: UserDto,
  ): Promise<AccessKeyDto> {
    const accessKey = await this.prisma.accessKey.findFirst({
      where: {
        id: accessKeyId,
        siteId: user.activeSite.id,
      },
      include: { accessControl: true },
    });

    if (!accessKey || !(userId || deviceId)) {
      throw new BadRequestException({
        code: PublicErrors.ACTION_DENIED,
        message: "Can't execute requested operation",
      });
    }

    let accessControl = null;
    if (!accessKey.accessControl) {
      accessControl = await this.prisma.accessControl.create({
        data: {
          userId,
          deviceId,
        },
      });
    } else {
      accessControl = await this.prisma.accessControl.update({
        where: { id: accessKey.accessControl.id },
        data: {
          ...(userId ? { userId } : {}),
          ...(deviceId ? { deviceId } : {}),
        },
      });
    }

    const updatedAccessKey = await this.prisma.accessKey.update({
      where: { id: accessKeyId },
      data: { accessControlId: accessControl.id },
      include: {
        accessKeyProvider: true,
        accessControl: { include: { user: true, device: true } },
      },
    });

    return updatedAccessKey;
  }

  async detachAccessKeyFromUserAndDevice(
    accessKeyId: number,
    userId: number,
    deviceId: number,
    user: UserDto,
  ): Promise<AccessKeyDto> {
    const accessKey = await this.prisma.accessKey.findFirst({
      where: {
        id: accessKeyId,
        siteId: user.activeSite.id,
      },
      include: { accessControl: true },
    });

    if (!accessKey || !(userId || deviceId)) {
      throw new BadRequestException({
        code: PublicErrors.ACTION_DENIED,
        message: "Can't execute requested operation",
      });
    }

    if (!accessKey.accessControl) {
      throw new BadRequestException({
        code: PublicErrors.ACCESS_KEY_IS_NOT_ATTACHED,
        message: 'Access key is not attached to any user or device',
      });
    }

    await this.prisma.accessControl.update({
      where: { id: accessKey.accessControl.id },
      data: {
        ...(userId ? { userId: null } : {}),
        ...(deviceId ? { deviceId: null } : {}),
      },
    });

    return this.prisma.accessKey.findFirst({
      where: { id: accessKeyId },
      include: {
        accessKeyProvider: true,
        accessControl: { include: { user: true, device: true } },
      },
    });
  }

  private async getTotalAccessKeysByStatus(
    user: UserDto,
    status?: AccessKeyStatus | null,
  ): Promise<number> {
    const totalAccessKeys = await this.prisma.accessKey.count({
      where: {
        siteId: user.activeSite.id,
        ...(status ? { status } : {}),
      },
    });

    return totalAccessKeys;
  }
}
