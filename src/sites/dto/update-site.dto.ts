import { PartialType } from '@nestjs/swagger';

import { SiteEntity } from '../entities';

export class UpdateSiteDto extends PartialType(SiteEntity) {}
