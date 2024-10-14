import { Address, Country, Site, SiteStatus } from '@prisma/client';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaCrudService, CrudQueryObj } from 'nestjs-prisma-crud';
import { omit as _omit, isEmpty as _isEmpty } from 'lodash';

import { GoogleStorageService } from '@~google-cloud/google-storage.service';
import { Pagination } from '@common/entities';
import { PrismaService } from '@~prisma/prisma.service';
import { PublicErrors, UserRole } from '@common/types';
import { UserDto } from '@users/dto';

import { GoogleCloudConfig } from '@common/configs/config.interface';

import { SiteDto, SitesOverviewDto } from './dto';

@Injectable()
export class SiteService {
  private readonly prismaCrud: PrismaCrudService;
  private readonly googleCloudConfig: GoogleCloudConfig;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly googleStorageService: GoogleStorageService,
  ) {
    this.googleCloudConfig =
      this.configService.get<GoogleCloudConfig>('googleCloud');
    this.prismaCrud = new PrismaCrudService({
      model: 'site',
      allowedJoins: [
        'users',
        'users.user',
        'users.user.role',
        'users.user.role.permissions',
        'devices',
        'diagnostics',
        'address',
        'address.country',
      ],
    });
  }

  async getSites(
    crudQuery: string,
    user: UserDto,
  ): Promise<Pagination<SiteDto>> {
    const isUserSuperAdmin = user.role.key === UserRole.SUPER_ADMIN;
    const parsedQuery: CrudQueryObj = JSON.parse(crudQuery);
    const sites: Pagination<SiteDto> = await this.prismaCrud.findMany({
      crudQuery: {
        ...parsedQuery,
        where: {
          ...parsedQuery.where,
          ...(isUserSuperAdmin ? {} : { users: { some: { userId: user.id } } }),
        },
      },
    });

    return sites;
  }

  async getSite(
    id: number,
    crudQuery: string,
    user: UserDto,
  ): Promise<SiteDto> {
    const parsedQuery: CrudQueryObj = JSON.parse(crudQuery);
    const site: SiteDto = await this.prismaCrud.findOne(id, {
      crudQuery: { ...parsedQuery, where: { ...parsedQuery.where } },
    });

    await this.checkUserSiteAccess(user, site);

    return site;
  }

  async removeSite(id: number, user: UserDto): Promise<SiteDto> {
    const site: Site = await this.prisma.site.findFirst({ where: { id } });

    if (!site) {
      throw new BadRequestException({
        code: PublicErrors.SITE_REMOVAL_DENIED,
        message: "Site can't be removed",
      });
    }

    await this.checkUserSiteAccess(user, site);

    await this.prisma.site.delete({ where: { id: site.id } });

    return site;
  }

  async upsert(user: UserDto, payload: SiteDto): Promise<Site> {
    if ('id' in payload) {
      await this.checkUserSiteAccess(user, payload);
    }

    if (_isEmpty(payload.address)) {
      throw new BadRequestException({
        code: PublicErrors.SITE_ADDRESS_MISSING,
        message: 'Site must have an address',
      });
    }

    const address = await this.upsertAddress(payload.address);
    const site = _omit(payload, [
      'id',
      'users',
      'address',
      'addressId',
      'createdAt',
      'updatedAt',
      'diagnostics',
      'devices',
    ]);
    const processedSite = await this.prisma.site.upsert({
      create: { ...site, addressId: address.id },
      update: { ...site, addressId: address.id },
      include: { address: { include: { country: true } } },
      where: { id: payload?.id ?? 0 },
    });

    if (user) {
      await this.prisma.userSite.upsert({
        create: {
          userId: user.id,
          siteId: processedSite.id,
        },
        update: {},
        where: { userId_siteId: { userId: user.id, siteId: processedSite.id } },
      });
    }

    return processedSite;
  }

  async upsertAddress(
    payload: Address & { country?: Country },
  ): Promise<Address> {
    let country = null;
    if (!_isEmpty(payload.country)) {
      country = await this.upsertCountry(payload.country);
    }

    const address = _omit(payload, [
      'id',
      'country',
      'countryId',
      'createdAt',
      'updatedAt',
    ]);
    return this.prisma.address.upsert({
      create: {
        ...address,
        ...(!_isEmpty(country)
          ? { countryId: country.id }
          : { countryId: null }),
      },
      update: {
        ...address,
        ...(!_isEmpty(country)
          ? { countryId: country.id }
          : { countryId: null }),
      },
      where: { id: payload?.id ?? 0 },
    });
  }

  async upsertCountry(payload: Country): Promise<Country> {
    const country = _omit(payload, ['id', 'createdAt', 'updatedAt']);
    return this.prisma.country.upsert({
      create: country,
      update: country,
      where: { id: payload?.id ?? 0 },
    });
  }

  async changeImage(file: Express.Multer.File, id: number): Promise<SiteDto> {
    const site = await this.prisma.site.findFirst({ where: { id } });

    if (!site) {
      throw new BadRequestException({
        code: 400,
        message: "Site doesn't exist",
      });
    }

    const bucketName = this.googleCloudConfig.bucketName;
    const logFileGcsKey = await this.googleStorageService.uploadFile(
      bucketName,
      `images/sites/${file.originalname}`,
      file,
    );

    const updatedSite = await this.prisma.site.update({
      where: { id },
      data: {
        imageUrl: `https://storage.cloud.google.com/${bucketName}/${logFileGcsKey}`,
      },
    });

    return updatedSite;
  }

  private async checkUserSiteAccess(
    user: UserDto,
    site: SiteDto,
  ): Promise<void> {
    const isUserSuperAdmin = user.role.key === UserRole.SUPER_ADMIN;
    const userData = await this.prisma.user.findUnique({
      where: {
        email: user.email.toLowerCase(),
        sites: { some: { siteId: site.id } },
      },
    });

    if (!userData && !isUserSuperAdmin) {
      throw new BadRequestException({
        code: PublicErrors.SITE_FORBIDDEN,
        message: 'You are not allowed to access this site',
      });
    }
  }

  async getSitesOverview(user: UserDto): Promise<SitesOverviewDto> {
    const totalSites = await this.getTotalSitesByStatus(user);
    const activeSites = await this.getTotalSitesByStatus(
      user,
      SiteStatus.ACTIVE,
    );
    const inactiveSites = await this.getTotalSitesByStatus(
      user,
      SiteStatus.INACTIVE,
    );

    const sitesOverview = { totalSites, activeSites, inactiveSites };

    return sitesOverview;
  }

  private async getTotalSitesByStatus(
    user: UserDto,
    status?: SiteStatus | null,
  ): Promise<number> {
    const isUserSuperAdmin = user.role.key === UserRole.SUPER_ADMIN;
    const totalSites = await this.prisma.site.count({
      where: {
        ...(isUserSuperAdmin ? {} : { users: { some: { userId: user.id } } }),
        ...(status ? { status } : {}),
      },
    });

    return totalSites;
  }
}
