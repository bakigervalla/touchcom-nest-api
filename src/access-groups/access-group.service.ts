import { AccessTime } from '@prisma/client';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CrudQueryObj, PrismaCrudService } from 'nestjs-prisma-crud';
import { omit as _omit, uniqBy as _uniqBy } from 'lodash';

import { AccessControlDto } from '@access-control/dto';
import { AccessTimeScheduleDto } from '@common/dto';
import { AccessTimeService } from '@access-times/access-time.service';
import { DeviceDto } from '@devices/dto';
import { Pagination } from '@common/entities';
import { PrismaService } from '@~prisma/prisma.service';
import { PublicErrors } from '@common/types';
import { UserDto } from '@users/dto';

import {
  AccessGroupDto,
  AccessExceptionDto,
  AccessGroupAccessExceptionDto,
} from './dto';

@Injectable()
export class AccessGroupService {
  private readonly accessGroupPrismaCrud: PrismaCrudService;
  private readonly usersPrismaCrud: PrismaCrudService;
  private readonly devicesPrismaCrud: PrismaCrudService;
  private readonly accessGroupExceptionPrismaCrud: PrismaCrudService;

  constructor(
    private readonly prisma: PrismaService,
    private readonly accessTimesService: AccessTimeService,
  ) {
    this.accessGroupPrismaCrud = new PrismaCrudService({
      model: 'accessGroup',
      allowedJoins: [
        'accessControls',
        'accessControls.user',
        'accessControls.user.role',
        'accessControls.device',
        'accessTimeSchedule',
        'accessTimeSchedule.accessTimes',
        'accessTimeSchedule.accessTimes.accessTime',
        'accessExceptions',
        'accessExceptions.accessException',
      ],
    });
    this.usersPrismaCrud = new PrismaCrudService({
      model: 'user',
      allowedJoins: ['role'],
    });
    this.devicesPrismaCrud = new PrismaCrudService({
      model: 'device',
      allowedJoins: [],
    });
    this.accessGroupExceptionPrismaCrud = new PrismaCrudService({
      model: 'accessGroupAccessException',
      allowedJoins: ['accessGroup', 'accessException'],
    });
  }

  async upsert(
    payload: AccessGroupDto,
    user: UserDto,
  ): Promise<AccessGroupDto> {
    const accessGroup = _omit(payload, [
      'id',
      'accessControls',
      'accessExceptions',
      'accessTimeSchedule',
      'totalDevices',
      'totalUsers',
      'users',
      'devices',
    ]);
    const upsertedAccessGroup: AccessGroupDto =
      await this.prisma.accessGroup.upsert({
        create: {
          ...accessGroup,
          siteId: user.activeSite.id,
        },
        update: {
          ...accessGroup,
          siteId: user.activeSite.id,
        },
        where: { id: payload?.id ?? 0 },
        include: {
          accessExceptions: { include: { accessException: true } },
          accessControls: { include: { user: true, device: true } },
          accessTimeSchedule: {
            include: { accessTimes: { include: { accessTime: true } } },
          },
        },
      });

    upsertedAccessGroup.totalDevices = _uniqBy(
      upsertedAccessGroup.accessControls,
      'deviceId',
    ).filter(
      (accessControl: AccessControlDto) => accessControl.deviceId,
    ).length;

    return _omit(upsertedAccessGroup, [
      'accessControls',
      'accessExceptions',
      'accessTimeSchedule',
    ]);
  }

  async syncAccessGroups(
    crudQuery: string,
  ): Promise<Pagination<AccessGroupDto>> {
    const parsedQuery: CrudQueryObj = JSON.parse(crudQuery);
    const accessGroups: Pagination<AccessGroupDto> =
      await this.accessGroupPrismaCrud.findMany({
        crudQuery: parsedQuery,
      });

    return accessGroups;
  }

  async getAccessGroups(
    crudQuery: string,
    user: UserDto,
  ): Promise<Pagination<AccessGroupDto>> {
    const parsedQuery: CrudQueryObj = JSON.parse(crudQuery);
    const accessGroups: Pagination<AccessGroupDto> =
      await this.accessGroupPrismaCrud.findMany({
        crudQuery: {
          ...parsedQuery,
          where: { ...parsedQuery.where, siteId: user.activeSite.id },
        },
      });

    accessGroups.data = accessGroups.data.map((accessGroup) => ({
      ..._omit(accessGroup, [
        'accessControls',
        'accessExceptions',
        'accessTimeSchedule',
      ]),
      totalDevices: _uniqBy(accessGroup.accessControls, 'deviceId').filter(
        (accessControl: AccessControlDto) => accessControl.deviceId,
      ).length,
    }));

    return accessGroups;
  }

  async getAccessGroup(
    id: number,
    crudQuery: string,
    user: UserDto,
  ): Promise<AccessGroupDto> {
    const parsedQuery: CrudQueryObj = JSON.parse(crudQuery);
    const accessGroup: AccessGroupDto =
      await this.accessGroupPrismaCrud.findOne(id, {
        crudQuery: {
          ...parsedQuery,
          where: { ...parsedQuery.where, siteId: user.activeSite.id },
        },
      });

    accessGroup.totalDevices = _uniqBy(
      accessGroup.accessControls,
      'deviceId',
    ).filter(
      (accessControl: AccessControlDto) => accessControl.deviceId,
    ).length;
    accessGroup.totalUsers = _uniqBy(
      accessGroup.accessControls,
      'userId',
    ).filter((accessControl: AccessControlDto) => accessControl.userId).length;

    return accessGroup;
  }

  async getAccessGroupDevices(
    id: number,
    crudQuery: string,
    user: UserDto,
  ): Promise<Pagination<DeviceDto>> {
    const parsedQuery: CrudQueryObj = JSON.parse(crudQuery);
    const accessGroup: AccessGroupDto =
      await this.accessGroupPrismaCrud.findOne(id, {
        crudQuery: {
          where: { siteId: user.activeSite.id },
        },
      });

    const accessGroupDeviceIds = _uniqBy(accessGroup.accessControls, 'deviceId')
      .filter((accessControl: AccessControlDto) => accessControl.deviceId)
      .map((accessControl: AccessControlDto) => accessControl.deviceId);

    const accessGroupDevices = await this.devicesPrismaCrud.findMany({
      crudQuery: {
        ...parsedQuery,
        where: { ...parsedQuery.where, id: { in: accessGroupDeviceIds } },
      },
    });

    return accessGroupDevices;
  }

  async getAccessGroupUsers(
    id: number,
    crudQuery: string,
    user: UserDto,
  ): Promise<Pagination<UserDto>> {
    const parsedQuery: CrudQueryObj = JSON.parse(crudQuery);
    const accessGroup: AccessGroupDto =
      await this.accessGroupPrismaCrud.findOne(id, {
        crudQuery: {
          where: { siteId: user.activeSite.id },
        },
      });

    const accessGroupUserIds = _uniqBy(accessGroup.accessControls, 'userId')
      .filter((accessControl: AccessControlDto) => accessControl.userId)
      .map((accessControl: AccessControlDto) => accessControl.userId);

    const accessGroupUsers = await this.usersPrismaCrud.findMany({
      crudQuery: {
        ...parsedQuery,
        where: {
          ...parsedQuery.where,
          id: { in: accessGroupUserIds },
        },
        joins: ['role'],
      },
    });

    return accessGroupUsers;
  }

  async upsertTimeSchedule(
    accessGroupId: number,
    payload: AccessTimeScheduleDto,
    user: UserDto,
  ): Promise<AccessTimeScheduleDto> {
    const payloadId = payload.id;
    const accessGroup = await this.prisma.accessGroup.findFirst({
      where: { id: accessGroupId, siteId: user.activeSite.id },
      include: {
        accessTimeSchedule: {
          include: { accessTimes: { include: { accessTime: true } } },
        },
      },
    });

    if (!accessGroup) {
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
      await this.prisma.accessGroup.update({
        where: {
          id: accessGroup.id,
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
    accessGroupId: number,
    user: UserDto,
  ): Promise<AccessTimeScheduleDto> {
    const accessGroup = await this.prisma.accessGroup.findFirst({
      where: { id: accessGroupId, siteId: user.activeSite.id },
      include: {
        accessTimeSchedule: {
          include: { accessTimes: { include: { accessTime: true } } },
        },
      },
    });

    if (!accessGroup) {
      throw new BadRequestException({
        code: PublicErrors.ACTION_DENIED,
        message: "Can't execute requested operation",
      });
    }

    return accessGroup.accessTimeSchedule;
  }

  async deleteTimeScheduleAccessTime(
    accessGroupId: number,
    timeScheduleId: number,
    accessTimeId: number,
    user: UserDto,
  ): Promise<AccessTime> {
    const accessGroup = await this.prisma.accessGroup.findFirst({
      where: {
        id: accessGroupId,
        accessTimeScheduleId: timeScheduleId,
        siteId: user.activeSite.id,
      },
      include: { accessExceptions: true },
    });

    if (!accessGroup) {
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

  async upsertException(
    accessGroupId: number,
    payload: AccessExceptionDto,
    user: UserDto,
  ): Promise<AccessGroupAccessExceptionDto> {
    const payloadId = payload.id;
    const accessGroup = await this.prisma.accessGroup.findFirst({
      where: {
        id: accessGroupId,
        ...(payload.id
          ? { accessExceptions: { some: { accessExceptionId: payload.id } } }
          : {}),
        siteId: user.activeSite.id,
      },
      include: { accessExceptions: true },
    });

    if (!accessGroup) {
      throw new BadRequestException({
        code: PublicErrors.ACTION_DENIED,
        message: "Can't execute requested operation",
      });
    }

    const accessException = _omit(payload, ['id', 'accessGroups']);
    const upsertedAccessException = await this.prisma.accessException.upsert({
      create: accessException,
      update: accessException,
      where: { id: payloadId ?? 0 },
    });

    if (!payloadId) {
      await this.prisma.accessGroupAccessException.create({
        data: {
          accessGroupId,
          accessExceptionId: upsertedAccessException.id,
        },
      });
    }

    const accessGroupAccessException =
      await this.prisma.accessGroupAccessException.findFirst({
        where: { accessGroupId, accessExceptionId: upsertedAccessException.id },
        include: { accessException: true },
      });

    return accessGroupAccessException;
  }

  async getExceptions(
    accessGroupId: number,
    crudQuery: string,
    user: UserDto,
  ): Promise<Pagination<AccessGroupAccessExceptionDto>> {
    const parsedQuery: CrudQueryObj = JSON.parse(crudQuery);

    const exceptions = await this.accessGroupExceptionPrismaCrud.findMany({
      crudQuery: {
        ...parsedQuery,
        where: {
          ...parsedQuery.where,
          accessGroupId,
          accessGroup: { siteId: user.activeSite.id },
        },
        joins: [
          ...(parsedQuery?.joins ?? []),
          'accessGroup',
          'accessException',
        ],
      },
    });

    return exceptions;
  }

  async deleteException(
    accessGroupId: number,
    exceptionId: number,
    user: UserDto,
  ): Promise<AccessExceptionDto> {
    const accessGroup = await this.prisma.accessGroup.findFirst({
      where: {
        id: accessGroupId,
        accessExceptions: { some: { accessExceptionId: exceptionId } },
        siteId: user.activeSite.id,
      },
      include: { accessExceptions: true },
    });

    if (!accessGroup) {
      throw new BadRequestException({
        code: PublicErrors.ACTION_DENIED,
        message: "Can't execute requested operation",
      });
    }

    await this.prisma.accessGroupAccessException.delete({
      where: {
        accessGroupId_accessExceptionId: {
          accessGroupId,
          accessExceptionId: exceptionId,
        },
      },
    });

    const exception = await this.prisma.accessException.delete({
      where: { id: exceptionId },
    });

    return exception;
  }

  async attachAccessGroupToUserAndDevice(
    accessGroupId: number,
    userId: number,
    deviceId: number,
    user: UserDto,
  ): Promise<UserDto | DeviceDto> {
    if (!(userId || deviceId)) {
      throw new BadRequestException({
        code: PublicErrors.ACTION_DENIED,
        message: "Can't execute requested operation",
      });
    }

    const accessControls = await this.prisma.accessControl.findMany({
      where: {
        ...(userId
          ? {
              userId,
              user: { sites: { some: { siteId: user.activeSite.id } } },
            }
          : {}),
        ...(deviceId
          ? { deviceId, device: { siteId: user.activeSite.id } }
          : {}),
      },
      include: { device: true, user: { include: { sites: true } } },
    });

    if (accessControls.length <= 0) {
      await this.prisma.accessControl.create({
        data: { userId, deviceId, accessGroupId },
      });
    } else {
      const accessControlsWithoutAccessGroup = accessControls.filter(
        (accessControl) => !!accessControl.accessGroupId,
      );

      if (accessControlsWithoutAccessGroup.length <= 0) {
        const accessControlsWithAccessGroup = accessControls.filter(
          (accessControl) => accessControl.accessGroupId === accessGroupId,
        );
        if (accessControlsWithAccessGroup.length > 0) {
          throw new BadRequestException({
            code: PublicErrors.ACTION_DENIED,
            message: "Can't execute requested operation",
          });
        }

        await this.prisma.accessControl.create({
          data: { userId, deviceId, accessGroupId },
        });
      }

      const accessControlsWithoutAccessGroupIds =
        accessControlsWithoutAccessGroup.map(
          (accessControlWithoutAccessGroup) =>
            accessControlWithoutAccessGroup.id,
        );
      await this.prisma.accessControl.updateMany({
        where: { id: { in: accessControlsWithoutAccessGroupIds } },
        data: { accessGroupId },
      });
    }

    if (userId) {
      const user = await this.prisma.user.findFirst({
        where: { id: userId },
        include: { role: true },
      });
      return user as UserDto;
    }

    return this.prisma.device.findFirst({ where: { id: deviceId } });
  }

  async detachAccessGroupFromUserAndDevice(
    accessGroupId: number,
    userId: number,
    deviceId: number,
    user: UserDto,
  ): Promise<UserDto | DeviceDto> {
    if (!(userId || deviceId)) {
      throw new BadRequestException({
        code: PublicErrors.ACTION_DENIED,
        message: "Can't execute requested operation",
      });
    }

    const accessControls = await this.prisma.accessControl.findMany({
      where: {
        accessGroupId,
        ...(userId
          ? {
              userId,
              user: { sites: { some: { siteId: user.activeSite.id } } },
            }
          : {}),
        ...(deviceId
          ? { deviceId, device: { siteId: user.activeSite.id } }
          : {}),
      },
      include: { device: true, user: { include: { sites: true } } },
    });

    if (accessControls.length <= 0) {
      throw new BadRequestException({
        code: PublicErrors.ACCESS_GROUP_IS_NOT_ATTACHED,
        message: 'Access group is not attached to any user or device',
      });
    }

    const accessControlIds = accessControls.map(
      (accessControl) => accessControl.id,
    );
    await this.prisma.accessControl.deleteMany({
      where: { id: { in: accessControlIds } },
    });

    if (userId) {
      const user = await this.prisma.user.findFirst({
        where: { id: userId },
        include: { role: true },
      });
      return user as UserDto;
    }

    return this.prisma.device.findFirst({ where: { id: deviceId } });
  }
}
