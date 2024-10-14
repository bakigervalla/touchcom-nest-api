import { Type } from 'class-transformer';

import { Pagination } from '@common/entities';

import { DeviceDto } from './device.dto';

export class PaginatedDevicesDto extends Pagination<DeviceDto> {
  @Type(() => DeviceDto)
  data: DeviceDto[];
}
