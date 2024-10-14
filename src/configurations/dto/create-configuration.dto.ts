import { PartialType } from '@nestjs/swagger';

import { ConfigurationEntity } from '../entities';

export class CreateConfigurationDto extends PartialType(ConfigurationEntity) {}
