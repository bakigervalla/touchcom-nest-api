import { ApiProperty } from '@nestjs/swagger';
import { Configuration, LockStatus, ScreenSize } from '@prisma/client';
import { IsEnum } from 'class-validator';
import { IsInt, Max, Min } from 'class-validator';

import { BaseEntity } from '@common/entities';

export class ConfigurationEntity extends BaseEntity implements Configuration {
  @ApiProperty()
  id: number;
  @IsEnum(LockStatus)
  lockStatus: LockStatus;
  @IsEnum(ScreenSize)
  screenSize: ScreenSize;
  @ApiProperty()
  heartbeatInterval: number;
  @ApiProperty()
  mainScreenDelay: number;
  @ApiProperty()
  waitBranchLevel: number;
  @ApiProperty()
  activeBranchLevel: number;
  @ApiProperty()
  volumeLevel: number;
  @ApiProperty()
  horizontal: boolean;
  @ApiProperty()
  rotation: number;
  @ApiProperty()
  cameraRotation: number;
  @IsInt()
  @Min(1)
  @Max(100)
  @ApiProperty()
  scaling: number;
  @ApiProperty()
  closeDoorTime: number;
  @ApiProperty()
  callTimeout: number;
  @ApiProperty()
  height: number;
  @ApiProperty()
  width: number;
  @ApiProperty()
  aspectRatioX: number;
  @ApiProperty()
  aspectRatioY: number;
  @ApiProperty()
  adbPort: number;
  @ApiProperty()
  isDarkTheme: boolean;
  @ApiProperty()
  darkThemeStart: Date;
  @ApiProperty()
  darkThemeEnd: Date;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}
