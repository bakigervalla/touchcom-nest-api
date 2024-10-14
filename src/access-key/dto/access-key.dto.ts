import { PartialType } from '@nestjs/swagger';

import { AccessKeyEntity } from '../entities';

export class AccessKeyDto extends PartialType(AccessKeyEntity) {}
