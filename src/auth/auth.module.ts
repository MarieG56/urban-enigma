import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { PrismaService } from 'prisma/prisma.service';
import { CustomerModule } from 'src/customer/customer.module';

@Module({
  imports: [AuthModule, CustomerModule],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService, PrismaService],
})
export class AuthModule {}
