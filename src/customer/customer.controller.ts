import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Prisma } from '@prisma/client';
import { Customer } from '@prisma/client';
import * as moment from 'moment-timezone';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  async createCustomer(@Body() body: CreateCustomerDto): Promise<Customer> {
    try {
      const customer = await this.customerService.findOne({
        email: body.email,
      });

      if (customer) {
        throw new HttpException('Email already in db', HttpStatus.CONFLICT);
      }
      const timezone = moment.tz.guess();

      const customerCreateInput: Prisma.CustomerCreateInput = {
        ...body,
        timezone,
      };

      return this.customerService.create(customerCreateInput);
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal server error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //   @Get()
  //   findAll() {
  //     return this.customerService.findAll();
  //   }

  //   @Get(':id')
  //   findOne(@Param('id') id: string) {
  //     return this.customerService.findOne(+id);
  //   }

  @Patch(':id')
  async updateCustomer(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateCustomerDto,
  ): Promise<Customer> {
    try {
      const customer = await this.customerService.findOne({ id });

      if (!customer) {
        throw new NotFoundException(`Customer with id ${id} doesn't exist`);
      }

      return await this.customerService.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new HttpException(
        'An error occurred while updating the customer',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //   @Delete(':id')
  //   remove(@Param('id') id: string) {
  //     return this.customerService.remove(+id);
  //   }
}
