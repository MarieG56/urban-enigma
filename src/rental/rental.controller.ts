import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  BadRequestException,
  Get,
} from '@nestjs/common';
import { RentalService } from './rental.service';
import { CreateRentalDto } from './dto/create-rental.dto';
import { Rental } from '@prisma/client';
import * as moment from 'moment-timezone';
import { RentalSchedulerService } from './rental.scheduler';
import { CustomerService } from '../customer/customer.service';
import { EmailService } from 'service/email.service';

@Controller('rental')
export class RentalController {
  constructor(
    private readonly rentalService: RentalService,
    private readonly customerService: CustomerService,
    private readonly rentalSchedulerService: RentalSchedulerService,
    private readonly emailService: EmailService, 
  ) {}

  @Post()
  async addRental(@Body() body: CreateRentalDto): Promise<Rental> {
    try {
      const { customer_id, rental_date, return_date } = body;

      const customer = await this.customerService.findOne({ id: customer_id });

      if (!customer) {
        throw new BadRequestException('Customer not found');
      }

      if (!customer.timezone) {
        throw new BadRequestException(
          'Impossible de déterminer le fuseau horaire.',
        );
      }

      const timezone = customer.timezone;

      const rentalDateUtc = moment.tz(rental_date, timezone).utc().toDate();
      const returnDateUtc = moment.tz(return_date, timezone).utc().toDate();
      const todayUtc = moment().utc().startOf('day').toDate();

      if (rentalDateUtc < todayUtc) {
        throw new BadRequestException(
          'La date de début de location ne peut pas être antérieure à aujourd’hui.',
        );
      }

      const rentalDuration = moment(returnDateUtc).diff(
        moment(rentalDateUtc),
        'days',
      );

      if (rentalDuration < 7 || rentalDuration > 21) {
        throw new BadRequestException(
          "La durée minimale d'une location est d'une semaine, mais ne doit pas excéder trois semaines.",
        );
      }

      const rental = await this.rentalService.create({
        rental_date: rentalDateUtc.toISOString(),
        return_date: returnDateUtc.toISOString(),
        customer: { connect: { id: body.customer_id } },
      });

      const daysUntilDue = this.calculateDaysUntilDue(returnDateUtc);

      if (daysUntilDue === 5 || daysUntilDue === 3) {
        await this.emailService.sendEmail(
          customer.email,
          `Rappel : Location ID ${rental.id} - Due dans ${daysUntilDue} jours`,
          `Ceci est un rappel que votre location (ID : ${rental.id}) est due dans ${daysUntilDue} jours.`
        );
      }

      // Vérification spéciale pour les tests (à J-8)
      if (daysUntilDue === 8) {
        await this.emailService.sendEmail(
          customer.email,
          `Rappel : Location ID ${rental.id} - Due dans ${daysUntilDue} jours`,
          `Ceci est un rappel que votre location (ID : ${rental.id}) est due dans ${daysUntilDue} jours.`
        );
      }

      return rental;
    } catch (error) {
      console.error('Error creating rental:', error);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private calculateDaysUntilDue(returnDate: Date): number {
    const now = new Date();
    const timeDiff = returnDate.getTime() - now.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24)); 
  }

  @Get('tasks')
  getScheduledTasks() {
    return this.rentalSchedulerService.getScheduledTasks();
  }

  @Post('manual-reminders')
  async triggerManualReminders() {
    await this.rentalSchedulerService.sendRentalRemindersManually();
    return { message: 'Rappels envoyés manuellement.' };
  }
}
