import { Injectable } from '@nestjs/common';
import { PrismaCrudService } from 'nestjs-prisma-crud';
import { User } from '@prisma/client';

import { PageOptionsDto } from '@common/dto';
import { Pagination } from '@common/entities';

import { PaginatedResidentsDto } from './dto';

@Injectable()
export class CompaniesService {
  async getCompanyResidents(
    id: string,
    pageOptions: PageOptionsDto,
  ): Promise<PaginatedResidentsDto> {
    const prismaCrud = new PrismaCrudService({
      model: 'user',
      allowedJoins: ['role'],
    });

    const residents: Pagination<User> = await prismaCrud.findMany({
      crudQuery: {
        where: { companyId: parseInt(id, 10) },
        joins: ['role'],
        orderBy: pageOptions.orderBy,
        page: pageOptions.page,
        pageSize: pageOptions.pageSize,
      },
    });

    return residents;
  }
}
