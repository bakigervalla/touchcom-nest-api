import { PartialType } from '@nestjs/swagger';

import { VersionEntity } from '../entities';

export class VersionDto extends PartialType(VersionEntity) {}
