import { Module } from '@nestjs/common';
import { RentalService } from './rental.service';
import { RentalController } from './rental.controller';
import { RentalSchedulerService } from './rental.scheduler';
import { EmailService } from 'service/email.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { CustomerModule } from 'customer/customer.module';

@Module({
  imports:[PrismaModule, CustomerModule],
  controllers: [RentalController],
  providers: [RentalService, RentalSchedulerService, EmailService],
})
export class RentalModule {}
