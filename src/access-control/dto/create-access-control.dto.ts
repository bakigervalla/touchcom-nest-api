import { PartialType } from '@nestjs/swagger';

import { AccessControlEntity } from '../entities';

export class CreateAccessControlDto extends PartialType(AccessControlEntity) {}
