import { PartialType } from '@nestjs/swagger';

import { ConfigurationEntity } from '../entities';

export class ConfigurationDto extends PartialType(ConfigurationEntity) {}
