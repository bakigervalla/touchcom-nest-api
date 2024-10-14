import { PartialType } from '@nestjs/swagger';

import { CreateAccessKeyProviderDto } from './create-access-key-provider.dto';

export class UpdateAccessKeyProviderDto extends PartialType(
  CreateAccessKeyProviderDto,
) {}
