import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RentalService } from './rental.service';
import * as moment from 'moment-timezone';
import { EmailService } from 'service/email.service';

export interface ScheduledTask {
  name: string;
  schedule: string;
  lastExecuted: Date;
}

@Injectable()
export class RentalSchedulerService {
  private readonly logger = new Logger(RentalSchedulerService.name);
  private scheduledTasks: ScheduledTask[] = [];

  constructor(
    private readonly rentalService: RentalService,
    private readonly emailService: EmailService, 
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async sendRentalReminders() {
    this.logger.log('Checking rentals for upcoming return dates...');
    const utcNow = moment.utc();

    const reminders = [5, 3]; 

    for (const daysBefore of reminders) {
      const rentalsDue = await this.rentalService.findRentalsDueOn(
        utcNow.clone().add(daysBefore, 'days')
      );

      for (const rental of rentalsDue) {
        await this.sendReminderIfTimeMatches(rental, daysBefore);
      }
    }

    // Vérification spéciale pour les tests (exemple avec un rappel à J-8)
    const testDaysBefore = 8; 
    const testRentalsDue = await this.rentalService.findRentalsDueOn(
      utcNow.clone().add(testDaysBefore, 'days')
    );

    for (const rental of testRentalsDue) {
      await this.sendReminderIfTimeMatches(rental, testDaysBefore);
    }
  }

  private async sendReminderIfTimeMatches(rental: any, daysBefore: number) {
    const customer = rental.customer;
    const timezone = customer.timezone;
    const localTime = moment.tz(timezone).hour(12).minute(0).second(0);

    if (moment().tz(timezone).isSame(localTime, 'hour')) {
      this.logger.log(
        `Sending ${daysBefore}-day reminder to ${customer.email} for rental ID ${rental.id}`,
      );
      
      // Envoi de l'email de rappel
      await this.emailService.sendEmail(
        customer.email,
        `Rappel: La location de ${rental.id} se termine dans ${daysBefore} jours`,
        `Ceci est un rappel que votre location (ID: ${rental.id}) se termine dans ${daysBefore} jours.`
      );
    }
  }

  public async sendRentalRemindersManually(): Promise<void> {
    this.logger.log('Manually triggering rental reminders...');
    await this.sendRentalReminders();
  }

  scheduleTask(taskName: string, cronExpression: string) {
    this.scheduledTasks.push({
      name: taskName,
      schedule: cronExpression,
      lastExecuted: new Date(),
    });
  }

  getScheduledTasks() {
    return this.scheduledTasks;
  }
}
