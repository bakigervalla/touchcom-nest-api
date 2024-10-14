import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Device, DeviceStatus, DeviceType } from '@prisma/client';

import { BaseEntity } from '@common/entities';

export class DeviceEntity extends BaseEntity implements Device {
  @ApiProperty()
  id: number;
  @ApiProperty()
  serialNumber: string;
  @ApiProperty()
  name: string;
  @ApiProperty({ required: false, nullable: true })
  description: string | null;
  @ApiProperty()
  @IsEnum(DeviceStatus)
  status: DeviceStatus;
  @IsEnum(DeviceType)
  type: DeviceType;
  @ApiProperty()
  floor: number;
  @ApiProperty()
  configurationId: number;
  @ApiProperty()
  versionId: number;
  @ApiProperty()
  siteId: number;
  @ApiProperty()
  imageUrl: string;
  @ApiProperty({ required: false, nullable: true })
  twilioRoomName: string | null;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}
