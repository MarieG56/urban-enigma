import { Injectable } from '@nestjs/common';
import { Customer, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CustomerService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.CustomerCreateInput):Promise<Customer> {
    return this.prisma.customer.create({
      data,
    });
  }

  async findOne(
    where: Prisma.CustomerWhereUniqueInput,
    select?: Prisma.CustomerSelect,
  ): Promise<Customer> {
    return this.prisma.customer.findUnique({
      where,
      select,
    });
  }

  async update(params: {
    where: Prisma.CustomerWhereUniqueInput;
    data: Prisma.CustomerUpdateInput;
  }): Promise<Customer> {
    const { where, data } = params;
    return this.prisma.customer.update({
      where,
      data,
    });
  }

  async deleteOne(where: Prisma.CustomerWhereUniqueInput): Promise<Customer> {
    return this.prisma.customer.delete({
      where,
    });
  }
}
