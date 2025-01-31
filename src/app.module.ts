import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomerModule } from './customer/customer.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ScheduleModule } from '@nestjs/schedule';
import { RentalModule } from './rental/rental.module';

@Module({
  imports: [CustomerModule, AuthModule, PrismaModule, ScheduleModule.forRoot(), RentalModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
