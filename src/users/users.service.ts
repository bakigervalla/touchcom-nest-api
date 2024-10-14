import { AccessKey, UserStatus, UserType } from '@prisma/client';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CrudQueryObj, PrismaCrudService } from 'nestjs-prisma-crud';
import { omit as _omit, uniqBy as _uniqBy } from 'lodash';
import { randomUUID } from 'crypto';

import { AccessControlDto } from '@access-control/dto';
import { DeviceDto } from '@devices/dto';
import { GoogleStorageService } from '@~google-cloud/google-storage.service';
import { Pagination } from '@common/entities';
import { PasswordService } from '@auth/password.service';
import { PrismaService } from '@~prisma/prisma.service';
import { PublicErrors, UserRole } from '@common/types';
import { SiteService } from '@sites/site.service';
import { TwilioService } from '@twilio/twilio.service';

import {
  GoogleCloudConfig,
  SendgridConfig,
} from '@common/configs/config.interface';

import {
  CreateUserDto,
  InviteUserDto,
  ResendUserInvitationDto,
  UserDto,
} from './dto';

@Injectable()
export class UsersService {
  private readonly environment: string;
  private readonly prismaCrud: PrismaCrudService;
  private readonly sendgridConfig: SendgridConfig;
  private readonly devicesPrismaCrud: PrismaCrudService;
  private readonly googleCloudConfig: GoogleCloudConfig;

  constructor(
    private readonly prisma: PrismaService,
    private readonly siteService: SiteService,
    private readonly twilioService: TwilioService,
    private readonly configService: ConfigService,
    private readonly passwordService: PasswordService,
    private readonly googleStorageService: GoogleStorageService,
  ) {
    this.environment = this.configService.get('environment');
    this.sendgridConfig = this.configService.get<SendgridConfig>('sendgrid');
    this.googleCloudConfig =
      this.configService.get<GoogleCloudConfig>('googleCloud');
    this.prismaCrud = new PrismaCrudService({
      model: 'user',
      allowedJoins: [
        'role',
        'role.permissions',
        'role.permissions.permission',
        'company',
        'apartment',
        'residents',
        'sites',
        'sites.site',
        'sites.site.address',
        'sites.site.address.country',
        'address',
        'address.country',
        'accessControls',
        'accessControls.device',
        'accessControls.device.configuration',
        'accessControls.accessKey',
        'accessControls.accessGroup',
      ],
    });
    this.devicesPrismaCrud = new PrismaCrudService({
      model: 'device',
      allowedJoins: [
        'site',
        'site.address',
        'site.address.country',
        'configuration',
        'version',
      ],
    });
  }

  async getUsers(
    crudQuery: string,
    user: UserDto,
  ): Promise<Pagination<UserDto>> {
    const parsedQuery: CrudQueryObj = JSON.parse(crudQuery);
    const users: Pagination<UserDto> = await this.prismaCrud.findMany({
      crudQuery: {
        ...parsedQuery,
        where: {
          ...parsedQuery.where,
          sites: { some: { siteId: user.activeSite.id } },
        },
      },
    });

    return users;
  }

  async getUser(
    id: number,
    crudQuery: string,
    user: UserDto,
  ): Promise<UserDto> {
    const parsedQuery: CrudQueryObj = JSON.parse(crudQuery);
    const userData: UserDto = await this.prismaCrud.findOne(id, {
      crudQuery: {
        ...parsedQuery,
        where: {
          ...parsedQuery.where,
          sites: { some: { siteId: user.activeSite.id } },
        },
      },
    });

    return userData;
  }

  async upsert(
    payload: CreateUserDto,
    sessionUser?: UserDto,
  ): Promise<UserDto> {
    const user = _omit(payload, [
      'accessControl',
      'accessControls',
      'confirmPassword',
      'sites',
      'company',
      'apartment',
      'activeSite',
    ]);

    if (user.password) {
      user.password = await this.passwordService.hashPassword(payload.password);
    }

    let newUserData = await this.prisma.user.findFirst({
      where: { ...('id' in user ? { id: user.id } : { email: user.email }) },
    });

    if (!('id' in user) && newUserData) {
      throw new BadRequestException({
        code: PublicErrors.ACTION_DENIED,
        message: "Can't execute requested operation",
      });
    }

    if (!('id' in user) && !newUserData && !('roleId' in user)) {
      const role = await this.prisma.role.findFirst({
        where: {
          key:
            payload.type === UserType.RESIDENT
              ? UserRole.STANDARD_USER
              : UserRole.SITE_ADMIN,
        },
      });
      user.roleId = role.id;
    }

    if ('id' in user && user.email) {
      const isEmailTaken = await this.prisma.user.findFirst({
        where: { NOT: { id: user.id }, email: user.email },
      });

      if (isEmailTaken) {
        throw new BadRequestException({
          code: PublicErrors.ACTION_DENIED,
          message: "Can't execute requested operation",
        });
      }

      newUserData = await this.prisma.user.findFirst({
        where: { id: user.id },
      });
    }

    let address = null;
    if ('address' in payload) {
      address = await this.siteService.upsertAddress(payload.address);
    }

    const upsertedUser = await this.prisma.user.upsert({
      create: {
        ..._omit(user, 'address'),
        ...('email' in user
          ? { email: user.email }
          : { email: newUserData.email }),
        ...('roleId' in user
          ? { roleId: user.roleId }
          : { roleId: newUserData.roleId }),
        ...(address ? { addressId: address.id } : {}),
      },
      update: {
        ..._omit(user, 'address'),
        ...('email' in user
          ? { email: user.email }
          : { email: newUserData.email }),
        ...('roleId' in user
          ? { roleId: user.roleId }
          : { roleId: newUserData.roleId }),
        ...(address ? { addressId: address.id } : {}),
      },
      where: { id: payload?.id ?? 0 },
    });

    if ('accessControl' in payload) {
      const accessControl = await this.prisma.accessControl.create({
        data: {
          userId: upsertedUser.id,
          ...('device' in payload.accessControl
            ? { deviceId: payload.accessControl.device.id }
            : {}),
          ...('accessGroup' in payload.accessControl
            ? { accessGroupId: payload.accessControl.accessGroup.id }
            : {}),
        },
      });
      if ('accessKey' in payload.accessControl) {
        const accessKey: AccessKey = _omit(payload.accessControl.accessKey, [
          'id',
          'number',
          'validFrom',
          'validTo',
        ]);
        const keyProvider = await this.prisma.accessKeyProvider.findFirst();

        const accessKeyWithTag = await this.prisma.accessKey.findFirst({
          where: { tag: accessKey.tag },
        });

        if (accessKeyWithTag) {
          throw new BadRequestException({
            code: PublicErrors.ACTION_DENIED,
            message: "Can't execute requested operation",
          });
        }

        await this.prisma.accessKey.create({
          data: {
            ...accessKey,
            accessControlId: accessControl.id,
            accessKeyProviderId: keyProvider.id,
            siteId: sessionUser.activeSite.id,
          },
        });
      }
      if (!('id' in user) && !newUserData) {
        await this.prisma.userSite.create({
          data: { userId: upsertedUser.id, siteId: sessionUser.activeSite.id },
        });
      }
    }

    return this.prisma.user.findFirst({
      where: { id: upsertedUser.id },
      include: {
        role: { include: { permissions: { include: { permission: true } } } },
        address: { include: { country: true } },
      },
    });
  }

  async resendUserInvitation(
    user: UserDto,
    payload: ResendUserInvitationDto,
  ): Promise<UserDto> {
    const existingUser = await this.prisma.user.findFirst({
      where: { email: payload.email },
      include: {
        role: { include: { permissions: { include: { permission: true } } } },
      },
    });
    const isUserPartOfActiveSite = await this.prisma.user.findFirst({
      where: {
        email: payload.email,
        sites: { some: { siteId: user.activeSite.id } },
      },
    });

    if (!existingUser || !isUserPartOfActiveSite) {
      throw new BadRequestException({
        code: PublicErrors.USER_INVITATION_DENIED,
        message: 'Unable to resend invitation for requested user',
      });
    }

    const updatedUser = await this.generateUserVerificationToken({
      id: existingUser.id,
      email: existingUser.email,
    });

    await this.twilioService.sendEmail({
      from: 'dev@touchcom.no',
      to: existingUser.email,
      templateId: this.sendgridConfig.inviteExistingUserTemplateId,
      dynamicTemplateData: {
        environment: this.environment,
        name: existingUser.firstName,
        siteName: user.activeSite.name,
        siteAddress: `${user.activeSite.address.street}, ${
          user.activeSite.address.city
        } ${user.activeSite.address.postalCode}, ${
          user.activeSite.address?.country?.name ?? ''
        }`,
        roleName: existingUser.role.name,
      },
    });

    return updatedUser;
  }

  async inviteUser(user: UserDto, payload: InviteUserDto): Promise<UserDto> {
    const existingUser = await this.prisma.user.findFirst({
      where: { email: payload.email },
      include: {
        role: { include: { permissions: { include: { permission: true } } } },
      },
    });
    const isUserPartOfActiveSite = await this.prisma.user.findFirst({
      where: {
        email: payload.email,
        sites: { some: { siteId: user.activeSite.id } },
      },
    });

    if (existingUser && isUserPartOfActiveSite) {
      throw new BadRequestException({
        code: PublicErrors.USER_INVITATION_DENIED,
        message: 'Unable to invite user to current site',
      });
    }

    if (existingUser && !isUserPartOfActiveSite) {
      await this.inviteExistingUser(user, existingUser);
      return existingUser;
    }

    const createdUser = await this.inviteNewUser(user, payload);

    return createdUser;
  }

  async getUserDevices(
    id: number,
    crudQuery: string,
    sessionUser: UserDto,
  ): Promise<Pagination<DeviceDto & { isVisible: boolean }>> {
    const parsedQuery: CrudQueryObj = JSON.parse(crudQuery);
    const user: UserDto = await this.prismaCrud.findOne(id, {
      crudQuery: {
        where: {
          sites: {
            some: { siteId: sessionUser.activeSite.id },
          },
        },
        joins: ['accessControls', 'sites'],
      },
    });

    const userDevicesAccessControl = _uniqBy(user.accessControls, 'deviceId')
      .filter((accessControl: AccessControlDto) => accessControl.deviceId)
      .reduce(
        (prev: AccessControlDto, accessControl: AccessControlDto) => ({
          ...prev,
          [accessControl.deviceId]: accessControl,
        }),
        {},
      );
    const userDevicesIds = Object.keys(userDevicesAccessControl).map((id) =>
      parseInt(id, 10),
    );

    const userDevices = await this.devicesPrismaCrud.findMany({
      crudQuery: {
        ...parsedQuery,
        where: {
          ...parsedQuery.where,
          id: { in: userDevicesIds },
        },
        joins: [
          'site',
          'site.address',
          'site.address.country',
          'configuration',
          'version',
        ],
      },
    });

    userDevices.data = userDevices.data.map((userDevice: DeviceDto) => ({
      ...userDevice,
      isVisible: (<AccessControlDto>userDevicesAccessControl[userDevice.id])
        .isVisible,
    }));

    return userDevices;
  }

  async changeImage(file: Express.Multer.File, id: number): Promise<UserDto> {
    const user = await this.prisma.user.findFirst({ where: { id } });

    if (!user) {
      throw new BadRequestException({
        code: 400,
        message: "User doesn't exist",
      });
    }

    const bucketName = this.googleCloudConfig.bucketName;
    const logFileGcsKey = await this.googleStorageService.uploadFile(
      bucketName,
      `images/users/${file.originalname}`,
      file,
    );

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        imageUrl: `https://storage.cloud.google.com/${bucketName}/${logFileGcsKey}`,
      },
    });

    return updatedUser;
  }

  private async inviteExistingUser(user: UserDto, existingUser: UserDto) {
    await this.prisma.userSite.create({
      data: {
        siteId: user.activeSite.id,
        userId: existingUser.id,
      },
    });
    await this.twilioService.sendEmail({
      from: 'dev@touchcom.no',
      to: existingUser.email,
      templateId: this.sendgridConfig.inviteExistingUserTemplateId,
      dynamicTemplateData: {
        environment: this.environment,
        name: existingUser.firstName,
        siteName: user.activeSite.name,
        siteAddress: `${user.activeSite.address.street}, ${
          user.activeSite.address.city
        } ${user.activeSite.address.postalCode}, ${
          user.activeSite.address?.country?.name ?? ''
        }`,
        roleName: existingUser.role.name,
      },
    });
  }

  private async inviteNewUser(
    user: UserDto,
    newUserRequest: InviteUserDto,
  ): Promise<UserDto> {
    const createdUser =
      await this.generateUserVerificationToken(newUserRequest);

    await this.prisma.userSite.create({
      data: {
        siteId: user.activeSite.id,
        userId: createdUser.id,
      },
    });

    await this.twilioService.sendEmail({
      from: 'dev@touchcom.no',
      to: createdUser.email,
      templateId: this.sendgridConfig.inviteNewUserTemplateId,
      dynamicTemplateData: {
        environment: this.environment,
        name: createdUser.firstName,
        siteName: user.activeSite.name,
        siteAddress: `${user.activeSite.address.street}, ${
          user.activeSite.address.city
        } ${user.activeSite.address.postalCode}, ${
          user.activeSite.address?.country?.name ?? ''
        }`,
        roleName: createdUser.role.name,
        verificationCode: createdUser.verificationCode,
      },
    });

    return createdUser;
  }

  private async generateUserVerificationToken(
    userRequest: UserDto,
  ): Promise<UserDto> {
    const token = randomUUID();
    const tokenExpirationTime = new Date();
    tokenExpirationTime.setHours(tokenExpirationTime.getHours() + 1);

    const user = await this.upsert({
      ...userRequest,
      verificationCode: token,
      verificationCodeExpiration: tokenExpirationTime,
      status: UserStatus.PENDING,
    } as CreateUserDto);

    return user;
  }
}
