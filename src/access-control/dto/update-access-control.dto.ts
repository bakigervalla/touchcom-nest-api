import { PartialType } from '@nestjs/swagger';

import { AccessControlEntity } from '../entities';

export class UpdateAccessControlDto extends PartialType(AccessControlEntity) {}
