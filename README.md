## Technologies Used

- **NestJS**: Framework for building efficient and scalable Node.js applications.
- **TypeScript**: Programming language used to develop the application.
- **Nodemailer**: Library for sending emails.
- **Prisma**: ORM used for interacting with the database.
- **Moment.js**: Library for manipulating dates and times.

## Project setup

1. Clone the repository:
https://github.com/MarieG56/urban-enigma.git

2. Install the dependencies: npm install

3. Configure your database in the `.env` file: DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

4. Run Prisma migrations: npx prisma migrate dev --name init

5. Start the server: npm run start:dev

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```


## Usage

### API Endpoints

#### Add a Rental

- **POST** `/rental`


#### Get Scheduled Tasks

- **GET** `/rental/tasks`

#### Send Manual Reminders

- **POST** `/rental/manual-reminders`

## Email Sending

To configure email sending, modify the `email.service.ts` file with your SMTP information:


## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

