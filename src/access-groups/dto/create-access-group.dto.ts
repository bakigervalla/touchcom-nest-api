import { ApiProperty, PartialType } from '@nestjs/swagger';
import { AccessGroupStatus, AccessControl } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { AccessGroupEntity } from '../entities';

export class CreateAccessGroupDto extends PartialType(AccessGroupEntity) {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(80)
  @ApiProperty()
  name: string;

  @IsOptional()
  @IsEnum(AccessGroupStatus)
  @ApiProperty()
  status: AccessGroupStatus;

  @IsOptional()
  @ApiProperty()
  accessControls?: AccessControl[];
}
