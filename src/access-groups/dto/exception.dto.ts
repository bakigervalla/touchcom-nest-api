import { PartialType } from '@nestjs/swagger';

import {
  AccessExceptionEntity,
  AccessGroupAccessExceptionEntity,
} from '../entities';

export class AccessGroupAccessExceptionDto extends PartialType(
  AccessGroupAccessExceptionEntity,
) {}

export class AccessExceptionDto extends PartialType(AccessExceptionEntity) {}
