import { Injectable } from '@nestjs/common';
import { Prisma, Rental } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RentalService {
  constructor(private readonly prisma: PrismaService) {}

  async findRentalsDueOn(targetDate: moment.Moment) {
    return this.prisma.rental.findMany({
      where: {
        return_date: {
          gte: targetDate.startOf('day').toDate(), 
          lt: targetDate.endOf('day').toDate(), 
        },
      },
      include: {
        customer: true,
      },
    });
  }
  
  async create(data: Prisma.RentalCreateInput): Promise<Rental> {
    return this.prisma.rental.create({
      data,
    });
  }

  findAll() {
    return `This action returns all rental`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rental`;
  }

  remove(id: number) {
    return `This action removes a #${id} rental`;
  }
}
