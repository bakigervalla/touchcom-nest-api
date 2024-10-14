import { Injectable } from '@nestjs/common';
import { PrismaCrudService } from 'nestjs-prisma-crud';

import { PAGE_OPTIONS } from '@common/utils/constants';

@Injectable()
export class GenericService extends PrismaCrudService {
  constructor(model: string, allowedJoins: string[]) {
    super({
      model,
      allowedJoins,
      defaultJoins: [],
      paginationConfig: {
        maxPageSize: PAGE_OPTIONS.MAX_PAGE_SIZE,
        defaultPageSize: PAGE_OPTIONS.DEFAULT_PAGE_SIZE,
        defaultOrderBy: PAGE_OPTIONS.DEFAULT_ORDER_BY,
      },
    });
  }
}
