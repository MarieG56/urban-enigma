import { Test, TestingModule } from '@nestjs/testing';
import { RentalController } from './rental.controller';
import { CustomerService } from '../customer/customer.service';
import { RentalService } from './rental.service';
import { RentalSchedulerService } from './rental.scheduler';
import { CreateRentalDto } from './dto/create-rental.dto';
import { Rental } from '@prisma/client';
import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import * as moment from 'moment-timezone';

jest.mock('./rental.service');
jest.mock('../customer/customer.service');
jest.mock('./rental.scheduler');

describe('RentalController', () => {
  let rentalController: RentalController;
  let rentalService: RentalService;
  let customerService: CustomerService;
  let rentalSchedulerService: RentalSchedulerService;

  const mockSendEmailReminder = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RentalController],
      providers: [
        { provide: CustomerService, useValue: { findOne: jest.fn() } },
        {
          provide: RentalService,
          useValue: {
            create: jest.fn(),
            findRentalsDueOn: jest.fn(),
          },
        },
        {
          provide: RentalSchedulerService,
          useValue: {
            sendEmailReminder: mockSendEmailReminder,
          },
        },
      ],
    }).compile();

    rentalController = module.get<RentalController>(RentalController);
    customerService = module.get<CustomerService>(CustomerService);
    rentalService = module.get<RentalService>(RentalService);
    rentalSchedulerService = module.get<RentalSchedulerService>(RentalSchedulerService);
  });

  it('should send reminder for rental ending in 8 days', async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-01-31T00:00:00Z')); 

    const fakeCustomer = {
      id: 1,
      first_name: 'Jean',
      last_name: 'Michel',
      email: 'jean@michel.com',
      timezone: 'Europe/Paris',
      password: "azerty",
      created_at: new Date(),
      updated_at: new Date(),
    };

    jest.spyOn(customerService, 'findOne').mockResolvedValue(fakeCustomer);

    const fakeRental = {
      id: 1,
      rental_date: new Date('2025-01-20'),
      return_date: new Date('2025-02-08'), 
      customer_id: fakeCustomer.id,
      created_at: new Date(),
      updated_at: new Date(),
      customer: fakeCustomer,
    };

    jest.spyOn(rentalService, 'create').mockResolvedValue(fakeRental); 
    jest.spyOn(rentalService, 'findRentalsDueOn').mockResolvedValue([fakeRental]);

    const createRentalDto: CreateRentalDto = {
      customer_id: fakeCustomer.id,
      rental_date: new Date('2025-01-31'),
      return_date: new Date('2025-02-08'), 
    };

    await rentalController.addRental(createRentalDto);

    expect(mockSendEmailReminder).toHaveBeenCalledWith(
      fakeCustomer.email,
      expect.objectContaining({
        id: fakeRental.id,
        return_date: fakeRental.return_date,
        customer_id: fakeCustomer.id,
      }),
      expect.any(Number), 
    );

    expect(mockSendEmailReminder).toHaveBeenCalledTimes(1);
  });
});
