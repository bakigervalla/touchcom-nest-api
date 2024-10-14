import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';

import { PAGE_OPTIONS } from '../utils/constants';

import { Order } from '../types';

class OrderBy {
  [key: string]: Order;
}

export abstract class PageOptionsDto {
  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @Transform((data) => parseInt(data.value, 10))
  @Min(1)
  @IsOptional()
  readonly page?: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: PAGE_OPTIONS.MAX_PAGE_SIZE,
    default: PAGE_OPTIONS.DEFAULT_PAGE_SIZE,
  })
  @Transform((data) => parseInt(data.value, 10))
  @Min(1)
  @Max(PAGE_OPTIONS.MAX_PAGE_SIZE)
  @IsOptional()
  readonly pageSize?: number = PAGE_OPTIONS.DEFAULT_PAGE_SIZE;

  @Transform((data) => JSON.parse(data.value))
  @ApiPropertyOptional({
    isArray: true,
    type: [OrderBy],
    default: PAGE_OPTIONS.DEFAULT_ORDER_BY,
  })
  @IsOptional()
  readonly orderBy?: OrderBy[] = PAGE_OPTIONS.DEFAULT_ORDER_BY;
}
