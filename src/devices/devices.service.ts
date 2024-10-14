import {
  AccessControlStatus,
  DeviceStatus,
  DeviceType,
  Diagnostics,
  User,
} from '@prisma/client';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'winston';
import { CrudQueryObj, PrismaCrudService } from 'nestjs-prisma-crud';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { omit as _omit, isEmpty as _isEmpty, uniqBy as _uniqBy } from 'lodash';

import { AccessControlDto } from '@access-control/dto';
import { AccessControlService } from '@access-control/access-control.service';
import { AccessGroupDto } from '@access-groups/dto';
import { ConfigurationService } from '@configurations/configuration.service';
import { CreateConfigurationDto, ConfigurationDto } from '@configurations/dto';
import { GoogleStorageService } from '@~google-cloud/google-storage.service';
import { Pagination } from '@common/entities';
import { Permission, PublicErrors } from '@common/types';
import { PrismaService } from '@~prisma/prisma.service';
import { RoleService } from '@roles/role.service';
import { Token } from '@auth/entities';
import { UserDto } from '@users/dto';
import { UsersService } from '@users/users.service';
import { VersionService } from '@version/version.service';

import common from '@common/utils/common';
import { DEVICE } from '@common/utils/constants';
import { GoogleCloudConfig } from '@common/configs/config.interface';

import {
  AccessKeyUnlockEvent,
  CreateDeviceDto,
  DeviceDto,
  DevicesOverviewDto,
} from './dto';

@Injectable()
export class DevicesService {
  private readonly prismaCrud: PrismaCrudService;
  private readonly usersPrismaCrud: PrismaCrudService;
  private readonly googleCloudConfig: GoogleCloudConfig;

  constructor(
    private readonly prisma: PrismaService,
    private readonly roleService: RoleService,
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
    private readonly versionService: VersionService,
    private readonly accessControlService: AccessControlService,
    private readonly configurationService: ConfigurationService,
    private readonly googleStorageService: GoogleStorageService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @Inject('DEVICE_SERVICE') private readonly mqttClient: ClientProxy,
  ) {
    this.googleCloudConfig =
      this.configService.get<GoogleCloudConfig>('googleCloud');
    this.prismaCrud = new PrismaCrudService({
      model: 'device',
      allowedJoins: [
        'site',
        'site.address',
        'site.address.country',
        'diagnostics',
        'configuration',
        'version',
        'accessControls',
        'accessControls.accessGroup',
        'accessControls.user',
        'accessControls.user.role',
        'accessControls.accessKey',
      ],
    });
    this.usersPrismaCrud = new PrismaCrudService({
      model: 'user',
      allowedJoins: ['role'],
    });
  }

  async upsert(payload: DeviceDto, user: UserDto): Promise<DeviceDto> {
    const configuration = await this.configurationService.upsert(
      payload.configuration,
    );
    const version = await this.versionService.upsert(payload.version);

    const device = _omit(payload, [
      'site',
      'address',
      'version',
      'credentials',
      'diagnostics',
      'configuration',
      'connectedUser',
      'accessControls',
    ]);
    return this.prisma.device.upsert({
      create: {
        ...device,
        siteId: user.activeSite.id,
        versionId: version.id,
        configurationId: configuration.id,
      },
      update: {
        ...device,
        siteId: user.activeSite.id,
        versionId: version.id,
        configurationId: configuration.id,
      },
      where: { id: payload?.id ?? 0 },
      include: {
        configuration: true,
        site: { include: { address: { include: { country: true } } } },
        version: true,
        diagnostics: true,
        accessControls: {
          include: {
            accessGroup: true,
            user: {
              include: {
                role: {
                  include: { permissions: { include: { permission: true } } },
                },
              },
            },
          },
        },
      },
    });
  }

  async getDevices(
    crudQuery: string,
    user: UserDto,
  ): Promise<Pagination<DeviceDto>> {
    const parsedQuery: CrudQueryObj = JSON.parse(crudQuery);
    const devices: Pagination<DeviceDto> = await this.prismaCrud.findMany({
      crudQuery: {
        ...parsedQuery,
        where: { ...parsedQuery.where, siteId: user.activeSite.id },
      },
    });

    return devices;
  }

  async getDevice(
    id: number,
    crudQuery: string,
    user: UserDto,
  ): Promise<DeviceDto> {
    const parsedQuery: CrudQueryObj = JSON.parse(crudQuery);
    const device: DeviceDto = await this.prismaCrud.findOne(id, {
      crudQuery: {
        ...parsedQuery,
        where: { ...parsedQuery.where, siteId: user.activeSite.id },
      },
    });

    if (!device) {
      throw new BadRequestException({
        code: PublicErrors.DEVICE_NOT_FOUND,
        message: 'Device not found',
      });
    }

    const connectedUserAccess = await this.prisma.accessControl.findFirst({
      where: {
        deviceId: device.id,
        user: {
          role: {
            permissions: { some: { permission: { key: Permission.DEVICE } } },
          },
        },
      },
      include: {
        user: {
          include: {
            role: {
              include: { permissions: { include: { permission: true } } },
            },
          },
        },
      },
    });

    device.connectedUser = connectedUserAccess?.user ?? null;

    return device;
  }

  async getUserDevices(
    crudQuery: string,
    user: UserDto,
  ): Promise<Pagination<DeviceDto>> {
    const parsedQuery: CrudQueryObj = JSON.parse(crudQuery || '{}');
    const devices: Pagination<DeviceDto> = await this.prismaCrud.findMany({
      crudQuery: {
        ...parsedQuery,
        where: {
          ...parsedQuery?.where,
          accessControls: {
            ...parsedQuery.where?.accessControls,
            some: {
              ...parsedQuery.where?.accessControls?.some,
              userId: user.id,
            },
          },
        },
        joins: [...(parsedQuery?.joins ?? []), 'accessControls'],
      },
    });

    return devices;
  }

  async deviceDiagnosticsReport(
    diagnostics: Diagnostics,
    file: Express.Multer.File,
    id: number,
  ): Promise<void> {
    const device = await this.prisma.device.findFirst({ where: { id } });

    if (!device) {
      throw new BadRequestException({
        code: 400,
        message: "Device doesn't exist",
      });
    }

    const logFileGcsKey = await this.googleStorageService.uploadFile(
      this.googleCloudConfig.bucketName,
      `device-logs/${file.originalname}`,
      file,
    );
    await this.prisma.diagnostics.create({
      data: {
        ...diagnostics,
        deviceId: id,
        logFileGcsKey,
      },
    });
  }

  async registerNewDevice(
    payload: CreateDeviceDto,
    requestUser: UserDto,
  ): Promise<DeviceDto> {
    const { email, password } = payload.credentials;

    let user = await this.prisma.user.findFirst({ where: { email } });

    await this.accessControlService.checkIfUserHasDeviceAccessInReview(user);

    payload.status = user
      ? DeviceStatus.REGISTRATION_IN_REVIEW
      : DeviceStatus.INACTIVE;
    const device = await this.upsert(payload, requestUser);

    if (!user && email && password) {
      const deviceSetupRoles = await this.roleService.getDeviceSetupRoles();
      user = (await this.userService.upsert(
        {
          email,
          password,
          accessControls: [],
          sites: [],
          roleId: deviceSetupRoles[0]?.id ?? null,
        },
        requestUser,
      )) as User;
    }

    if (user) {
      await this.accessControlService.connectUserWithDevice(
        user.id,
        device.id,
        false,
      );
      await this.createUserDeviceConfiguration(
        user,
        device.id.toString(),
        device.configuration,
      );
      await this.prisma.userSite.create({
        data: { userId: user.id, siteId: requestUser.activeSite.id },
      });
    }

    return device;
  }

  async enableDeviceAccess(
    user: UserDto,
    device: Omit<
      DeviceDto,
      'accessControls' | 'site' | 'version' | 'configuration'
    >,
  ): Promise<DeviceDto> {
    const userDeviceAccess =
      await this.accessControlService.getUserDeviceAccess(user.id, device.id);

    if (!userDeviceAccess) {
      return device;
    }

    const updatedDevice = await this.prisma.device.update({
      where: { id: userDeviceAccess.device.id },
      data: { ...device, status: DeviceStatus.ACTIVE },
    });

    await this.prisma.accessControl.update({
      where: { id: userDeviceAccess.id },
      data: { status: AccessControlStatus.ACTIVE },
    });

    return updatedDevice;
  }

  async invalidateOldDeviceAccess(
    user: UserDto,
    serialNumber?: string,
  ): Promise<void> {
    const activeUserDeviceAccess =
      await this.accessControlService.getActiveUserDeviceAccess(
        user.id,
        serialNumber,
      );

    if (!activeUserDeviceAccess) {
      return;
    }

    await this.prisma.device.update({
      where: { id: activeUserDeviceAccess.device.id },
      data: { status: DeviceStatus.INACTIVE },
    });

    await this.prisma.accessControl.update({
      where: { id: activeUserDeviceAccess.id },
      data: { status: AccessControlStatus.BLOCKED },
    });

    this.mqttClient.emit(
      `device/${activeUserDeviceAccess.device.serialNumber}/reset`,
      {},
    );
  }

  async sendRegistrationApprovalConfirmation(
    device: DeviceDto,
    tokens: Token,
  ): Promise<void> {
    this.mqttClient.emit(
      `device/${device.serialNumber}/registration-verification`,
      {
        ...tokens,
        deviceId: device.id,
        inReview: false,
        isApproved: true,
      },
    );
  }

  async removeUnapprovedDevice(
    user: UserDto,
    device: DeviceDto,
  ): Promise<void> {
    const userDevice = await this.prisma.accessControl.findFirst({
      where: {
        userId: user.id,
        deviceId: device.id,
        status: AccessControlStatus.PENDING,
      },
    });

    await this.prisma.accessControl.delete({
      where: { id: userDevice.id },
    });

    await this.prisma.device.delete({ where: { id: device.id } });

    this.mqttClient.emit(
      `device/${device.serialNumber}/registration-verification`,
      {
        inReview: false,
        isApproved: false,
      },
    );
  }

  async removeDeviceAccessFromUsers(device: DeviceDto): Promise<void> {
    const deviceAccesses = await this.prisma.accessControl.findMany({
      where: { deviceId: device.id },
      include: { user: true },
    });

    if (!deviceAccesses) {
      throw new BadRequestException({
        code: PublicErrors.DEVICE_ACCESS_REMOVAL_DENIED,
        message: "Device access can't be removed",
      });
    }

    const deviceSetupRoles = await this.roleService.getDeviceSetupRoles();
    for (const deviceAccess of deviceAccesses) {
      const { user } = deviceAccess;
      await this.prisma.accessControl.delete({
        where: { id: deviceAccess.id },
      });
      const userAccesses =
        await this.accessControlService.getUserDeviceAccesses(user.id);
      if (
        userAccesses.length <= 0 &&
        deviceSetupRoles.some((role) => role.id === user.roleId)
      ) {
        await this.prisma.user.delete({ where: { id: user.id } });
      }
    }

    await this.prisma.device.delete({ where: { id: device.id } });

    this.mqttClient.emit(`device/${device.serialNumber}/reset`, {});
  }

  async updateDeviceInReview(
    device: DeviceDto,
    serialNumber: string,
  ): Promise<DeviceDto> {
    const updatedDevice = (await this.prisma.device.update({
      where: { id: device.id },
      data: { serialNumber: serialNumber },
    })) as DeviceDto & { inReview?: boolean };
    updatedDevice.inReview = true;
    return updatedDevice;
  }

  async confirmDeviceRegistration(
    user: UserDto,
    device: DeviceDto,
    serialNumber: string,
  ): Promise<DeviceDto & { inReview?: boolean }> {
    if (!device.serialNumber.includes(DEVICE.DUMMY_SERIAL_NUMBER_CHARACTER)) {
      return null;
    }

    if (device.status === DeviceStatus.REGISTRATION_IN_REVIEW) {
      return this.updateDeviceInReview(device, serialNumber);
    }

    device.serialNumber = serialNumber;
    return this.enableDeviceAccess(user, device);
  }

  async validateUnprocessedDevices(
    user: UserDto,
    userDevices: AccessControlDto[],
    serialNumber: string,
  ): Promise<DeviceDto & { inReview?: boolean }> {
    for (const userDevice of userDevices) {
      const deviceInReview = await this.prisma.device.findFirst({
        where: {
          id: userDevice.device.id,
          serialNumber: { contains: DEVICE.DUMMY_SERIAL_NUMBER_CHARACTER },
        },
      });
      if (deviceInReview && deviceInReview.status === DeviceStatus.INACTIVE) {
        return this.confirmDeviceRegistration(
          user,
          deviceInReview,
          serialNumber,
        );
      }
      if (
        deviceInReview &&
        deviceInReview.status === DeviceStatus.REGISTRATION_IN_REVIEW
      ) {
        return this.updateDeviceInReview(deviceInReview, serialNumber);
      }
    }

    return null;
  }

  async validateDeviceInReview(
    user: UserDto,
    device: DeviceDto,
    serialNumber: string,
  ): Promise<DeviceDto> {
    let processedDevice = null;
    const userDevices = await this.accessControlService.getUserDeviceAccesses(
      user.id,
    );

    const shouldValidateDeviceRegistration = !device && userDevices.length > 0;
    if (!shouldValidateDeviceRegistration) {
      throw new BadRequestException({
        code: PublicErrors.USER_DEVICE_ACCESS_FORBIDDEN,
        message: "You don't have rights to enter",
      });
    }

    if (userDevices.length === 1) {
      processedDevice = await this.confirmDeviceRegistration(
        user,
        userDevices[0].device,
        serialNumber,
      );
    } else {
      processedDevice = await this.validateUnprocessedDevices(
        user,
        userDevices,
        serialNumber,
      );
    }

    if (!processedDevice) {
      throw new BadRequestException({
        code: PublicErrors.USER_DEVICE_ACCESS_FORBIDDEN,
        message: "You don't have rights to enter",
      });
    }

    return processedDevice;
  }

  async resetDevice(id: number): Promise<DeviceDto> {
    let device = await this.prisma.device.findFirst({ where: { id } });

    if (
      !device ||
      device.status !== DeviceStatus.ACTIVE ||
      device.serialNumber.includes(DEVICE.DUMMY_SERIAL_NUMBER_CHARACTER)
    ) {
      throw new BadRequestException({
        code: PublicErrors.DEVICE_RESET_DENIED,
        message: "Device can't be reset",
      });
    }

    device = await this.prisma.device.update({
      where: { id },
      data: { status: DeviceStatus.INACTIVE },
    });

    this.mqttClient.emit(`device/${device.serialNumber}/reset`, {});

    return device;
  }

  async removeDevice(id: number): Promise<DeviceDto> {
    const device = await this.prisma.device.findFirst({ where: { id } });

    if (
      !device ||
      device.status === DeviceStatus.REGISTRATION_IN_REVIEW ||
      device.serialNumber.includes(DEVICE.DUMMY_SERIAL_NUMBER_CHARACTER)
    ) {
      throw new BadRequestException({
        code: PublicErrors.DEVICE_REMOVAL_DENIED,
        message: "Device can't be removed",
      });
    }

    await this.removeDeviceAccessFromUsers(device);

    return device;
  }

  async getDeviceConfiguration(deviceId: number): Promise<ConfigurationDto> {
    const device = await this.prisma.device.findFirst({
      where: { id: deviceId },
      include: { configuration: true },
    });

    return device.configuration;
  }

  async getUserDeviceConfiguration(
    user: UserDto,
    deviceId: string,
  ): Promise<ConfigurationDto> {
    const userDeviceConfiguration =
      await this.prisma.userDeviceConfiguration.findFirst({
        where: {
          userId: user.id,
          deviceId: parseInt(deviceId, 10),
        },
        include: { deviceConfiguration: true },
      });

    if (!userDeviceConfiguration) {
      throw new BadRequestException({
        code: PublicErrors.USER_DEVICE_CONFIGURATION_MISSING,
        message: "User doesn't have device configuration",
      });
    }

    return userDeviceConfiguration.deviceConfiguration;
  }

  async createUserDeviceConfiguration(
    user: UserDto,
    deviceId: string,
    payload: CreateConfigurationDto,
  ): Promise<ConfigurationDto> {
    const cleanedPayload = _omit(payload, ['id', 'createdAt', 'updatedAt']);
    const configuration = await this.prisma.configuration.create({
      data: cleanedPayload,
    });

    await this.prisma.userDeviceConfiguration.create({
      data: {
        userId: user.id,
        deviceId: parseInt(deviceId, 10),
        deviceConfigurationId: configuration.id,
      },
    });

    return configuration;
  }

  async getDeviceUsers(
    id: number,
    crudQuery: string,
    user: UserDto,
  ): Promise<
    Pagination<UserDto & { isVisible: boolean; accessGroup: AccessGroupDto }>
  > {
    const parsedQuery: CrudQueryObj = JSON.parse(crudQuery);
    const device: DeviceDto = await this.prismaCrud.findOne(id, {
      crudQuery: {
        where: { siteId: user.activeSite.id },
        joins: ['accessControls', 'accessControls.accessGroup'],
      },
    });

    const deviceUsersAccessControl = _uniqBy(device.accessControls, 'userId')
      .filter((accessControl: AccessControlDto) => accessControl.userId)
      .reduce(
        (prev: AccessControlDto, accessControl: AccessControlDto) => ({
          ...prev,
          [accessControl.userId]: accessControl,
        }),
        {},
      );
    const deviceUsersIds = Object.keys(deviceUsersAccessControl).map((id) =>
      parseInt(id, 10),
    );

    const deviceUsers = await this.usersPrismaCrud.findMany({
      crudQuery: {
        ...parsedQuery,
        where: {
          ...parsedQuery.where,
          id: { in: deviceUsersIds },
        },
        joins: ['role'],
      },
    });

    deviceUsers.data = deviceUsers.data.map((deviceUser: UserDto) => ({
      ...deviceUser,
      isVisible: (<AccessControlDto>deviceUsersAccessControl[deviceUser.id])
        .isVisible,
      accessGroup: (<AccessControlDto>deviceUsersAccessControl[deviceUser.id])
        .accessGroup,
    }));

    return deviceUsers;
  }

  async changeUserVisibilityOnDevice(
    deviceId: number,
    userId: number,
    isVisible: boolean,
    sessionUser: UserDto,
  ): Promise<UserDto & { isVisible: boolean }> {
    const accessControl = await this.prisma.accessControl.findFirst({
      where: {
        deviceId,
        userId,
        device: { siteId: sessionUser.activeSite.id },
      },
      include: { device: true },
    });

    if (!accessControl) {
      throw new BadRequestException({
        code: PublicErrors.ACTION_DENIED,
        message: "Can't execute requested operation",
      });
    }

    await this.prisma.accessControl.updateMany({
      where: {
        deviceId,
        userId,
        device: { siteId: sessionUser.activeSite.id },
      },
      data: { isVisible },
    });

    return { id: userId, isVisible };
  }

  async addUserToDevice(
    deviceId: number,
    userId: number,
    sessionUser: UserDto,
  ): Promise<UserDto & { isVisible: boolean; accessGroup: AccessGroupDto }> {
    let isAccessControlUpdated = false;
    const accessControl = await this.prisma.accessControl.findFirst({
      where: {
        deviceId,
        userId,
        accessGroupId: { equals: null },
        device: { siteId: sessionUser.activeSite.id },
      },
      include: { device: true },
    });

    if (accessControl) {
      throw new BadRequestException({
        code: PublicErrors.ACTION_DENIED,
        message: 'Users is already part of requested device',
      });
    }

    const accessControlsWithoutUser = await this.prisma.accessControl.findMany({
      where: {
        deviceId,
        userId: { equals: null },
        device: { siteId: sessionUser.activeSite.id },
      },
      include: { device: true },
    });

    if (accessControlsWithoutUser.length > 0) {
      const accessControlsWithoutUserIds = accessControlsWithoutUser.map(
        (accessControlWithoutUser) => accessControlWithoutUser.id,
      );
      await this.prisma.accessControl.updateMany({
        where: { id: { in: accessControlsWithoutUserIds } },
        data: { userId },
      });
      isAccessControlUpdated = true;
    }

    const accessControlsWithoutDevice =
      await this.prisma.accessControl.findMany({
        where: {
          deviceId: { equals: null },
          userId,
        },
      });

    if (accessControlsWithoutDevice.length > 0) {
      const accessControlsWithoutDeviceIds = accessControlsWithoutDevice.map(
        (accessControlWithoutDevice) => accessControlWithoutDevice.id,
      );
      await this.prisma.accessControl.updateMany({
        where: { id: { in: accessControlsWithoutDeviceIds } },
        data: { deviceId },
      });
      isAccessControlUpdated = true;
    }

    if (!isAccessControlUpdated) {
      await this.prisma.accessControl.create({
        data: { deviceId, userId },
      });
    }

    const accessControlAfterAttachment =
      await this.prisma.accessControl.findFirst({
        where: {
          deviceId,
          userId,
          device: { siteId: sessionUser.activeSite.id },
        },
        include: { user: true, accessGroup: true },
      });

    return {
      ...accessControlAfterAttachment.user,
      isVisible: accessControlAfterAttachment.isVisible,
      accessGroup: accessControlAfterAttachment.accessGroup,
    };
  }

  async removeUserFromDevice(
    deviceId: number,
    userId: number,
    sessionUser: UserDto,
  ): Promise<UserDto> {
    const accessControl = await this.prisma.accessControl.findFirst({
      where: {
        deviceId,
        userId,
        device: { siteId: sessionUser.activeSite.id },
      },
      include: { device: true },
    });

    if (!accessControl) {
      throw new BadRequestException({
        code: PublicErrors.ACTION_DENIED,
        message: "Can't execute requested operation",
      });
    }

    await this.prisma.accessControl.deleteMany({ where: { userId, deviceId } });

    return { id: userId };
  }

  async changeImage(file: Express.Multer.File, id: number): Promise<DeviceDto> {
    const device = await this.prisma.device.findFirst({ where: { id } });

    if (!device) {
      throw new BadRequestException({
        code: 400,
        message: "Device doesn't exist",
      });
    }

    const bucketName = this.googleCloudConfig.bucketName;
    const logFileGcsKey = await this.googleStorageService.uploadFile(
      bucketName,
      `images/devices/${file.originalname}`,
      file,
    );

    const updatedDevice = await this.prisma.device.update({
      where: { id },
      data: {
        imageUrl: `https://storage.cloud.google.com/${bucketName}/${logFileGcsKey}`,
      },
    });

    return updatedDevice;
  }

  async initiateGsmCall(
    id: number,
    callee: UserDto & { callId: string },
  ): Promise<void> {
    const device = await this.prisma.device.findFirst({ where: { id } });
    const user = await this.prisma.user.findFirst({ where: { id: callee.id } });

    if (!device || !user) {
      this.logger.warn(`GSM call (ID: ${callee.callId}) couldn't be processed`);
      return;
    }

    this.logger.info(
      `Starting GSM call (ID: ${callee.callId}) from device ${device.name} (ID: ${device.serialNumber}) to ${user.firstName} ${user.lastName} (${user.phone}).`,
      DevicesService.name,
    );
  }

  async gsmCallAnswered(
    id: number,
    callee: UserDto & { callId: string },
  ): Promise<void> {
    const device = await this.prisma.device.findFirst({ where: { id } });
    const user = await this.prisma.user.findFirst({ where: { id: callee.id } });

    if (!device || !user) {
      this.logger.warn(`GSM call (ID: ${callee.callId}) couldn't be processed`);
      return;
    }

    this.logger.info(
      `GSM call (ID: ${callee.callId}) started between device ${device.name} (ID: ${device.serialNumber}) and ${user.firstName} ${user.lastName} (${user.phone}).`,
      DevicesService.name,
    );
  }

  async gsmCallNoAnswer(
    id: number,
    callee: UserDto & { callId: string },
  ): Promise<void> {
    const device = await this.prisma.device.findFirst({ where: { id } });
    const user = await this.prisma.user.findFirst({ where: { id: callee.id } });

    if (!device || !user) {
      this.logger.warn(`GSM call (ID: ${callee.callId}) couldn't be processed`);
      return;
    }

    this.logger.warn(
      `No answer on a GSM call (ID: ${callee.callId}) from device ${device.name} (ID: ${device.serialNumber}) to ${user.firstName} ${user.lastName} (${user.phone}).`,
      DevicesService.name,
    );
  }

  async gsmCallEnded(
    id: number,
    callee: UserDto & { callId: string },
  ): Promise<void> {
    const device = await this.prisma.device.findFirst({ where: { id } });
    const user = await this.prisma.user.findFirst({ where: { id: callee.id } });

    if (!device || !user) {
      this.logger.warn(`GSM call (ID: ${callee.callId}) couldn't be processed`);
      return;
    }

    this.logger.info(
      `GSM call (ID: ${callee.callId}) ended between device ${device.name} (ID: ${device.serialNumber}) and ${user.firstName} ${user.lastName} (${user.phone}).`,
      DevicesService.name,
    );
  }

  async gsmCallFailed(
    id: number,
    callee: UserDto & { callId: string },
  ): Promise<void> {
    const device = await this.prisma.device.findFirst({ where: { id } });
    const user = await this.prisma.user.findFirst({ where: { id: callee.id } });

    if (!device || !user) {
      this.logger.warn(`GSM call (ID: ${callee.callId}) couldn't be processed`);
      return;
    }

    this.logger.warn(
      `GSM call (ID: ${callee.callId}) failed between device ${device.name} (ID: ${device.serialNumber}) and ${user.firstName} ${user.lastName} (${user.phone}).`,
      DevicesService.name,
    );
  }

  async openDoor(
    id: number,
    callee: UserDto & { callId: string },
  ): Promise<void> {
    const device = await this.prisma.device.findFirst({ where: { id } });
    const user = await this.prisma.user.findFirst({ where: { id: callee.id } });

    if (!device || !user) {
      this.logger.warn("Request to open doors couldn't be processed");
      return;
    }

    this.logger.info(
      `Received request to open doors for device ${device.name} (ID: ${
        device.serialNumber
      }) from ${common.getUserFullName(user)} (${user.phone}).`,
      DevicesService.name,
    );
  }

  async accessKeyLogs(
    id: number,
    payload: AccessKeyUnlockEvent[],
  ): Promise<void> {
    const device = await this.prisma.device.findFirst({ where: { id } });

    if (!device) {
      this.logger.warn(
        "Request to log access key events couldn't be processed",
      );
      return;
    }

    for (const accessKeyUnlockEvent of payload) {
      const user = await this.prisma.user.findFirst({
        where: { id: accessKeyUnlockEvent.userId },
      });

      this.logger.info(
        `${common.getUserFullName(user)} (ID: ${user.id}) used RFID ${
          accessKeyUnlockEvent.tag
        } ${
          accessKeyUnlockEvent.isPinCodeUsed ? 'with' : 'without'
        } pin code at ${new Date(accessKeyUnlockEvent.timestamp * 1000)}.`,
        DevicesService.name,
      );
    }
  }

  async getDevicesOverview(user: UserDto): Promise<DevicesOverviewDto> {
    const totalDevices = await this.getTotalDevicesByType(user);
    const visitorPanels = await this.getTotalDevicesByType(
      user,
      DeviceType.VISITOR_PANEL,
    );
    const doors = await this.getTotalDevicesByType(user, DeviceType.DOOR);

    const devicesOverview = { totalDevices, visitorPanels, doors };

    return devicesOverview;
  }

  private async getTotalDevicesByType(
    user: UserDto,
    type?: DeviceType | null,
  ): Promise<number> {
    const totalDevices = await this.prisma.device.count({
      where: {
        siteId: user.activeSite.id,
        ...(type ? { type } : {}),
      },
    });

    return totalDevices;
  }
}
