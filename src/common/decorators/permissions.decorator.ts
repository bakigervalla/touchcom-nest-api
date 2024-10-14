import { SetMetadata } from '@nestjs/common';

import { Permission } from '@common/types';

export const Permissions = (...permissions: Permission[]) =>
  SetMetadata('permissions', permissions);
