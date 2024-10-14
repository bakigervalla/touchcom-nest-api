import { PartialType } from '@nestjs/swagger';

import { VersionEntity } from '../entities';

export class UpdateVersionDto extends PartialType(VersionEntity) {}
