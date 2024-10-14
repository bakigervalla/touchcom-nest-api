import { PartialType } from '@nestjs/swagger';

import { AccessKeyProviderEntity } from '../entities';

export class AccessKeyProviderDto extends PartialType(
  AccessKeyProviderEntity,
) {}
