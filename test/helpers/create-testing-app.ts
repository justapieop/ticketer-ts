import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmTicketSchema } from 'src/infra/typeorm/TypeOrmTicket.schema';
import { TypeOrmTicketRepository } from 'src/infra/typeorm/TypeOrmTicket.repository';
import { TICKET_REPOSITORY, type TicketRepository } from 'src/domain/ticket/ports/TicketRepository.port';
import { TICKET_ID_GENERATOR, type TicketIdGenerator } from 'src/domain/ticket/ports/TicketIdGenerator.port';
import { TICKET_USE_CASES } from 'src/domain/ticket/ports/TicketUseCases.port';
import { TicketService } from 'src/app/ticket/Ticket.service';
import { CreateTicketCommand } from 'src/infra/commands/CreateTicket.command';
import { ListTicketCommand } from 'src/infra/commands/ListTicket.command';
import { GetTicketCommand } from 'src/infra/commands/GetTicket.command';
import { EditTicketCommand } from 'src/infra/commands/EditTicket.command';

export async function createTestingApp(): Promise<{ app: INestApplication; moduleRef: TestingModule }> {
  const moduleRef: TestingModule = await Test.createTestingModule({
    imports: [
      TypeOrmModule.forRoot({
        type: 'better-sqlite3',
        database: ':memory:',
        dropSchema: true,
        entities: [TypeOrmTicketSchema],
        synchronize: true,
        logging: false,
      }),
      TypeOrmModule.forFeature([TypeOrmTicketSchema]),
    ],
    providers: [
      TypeOrmTicketRepository,
      {
        provide: TICKET_REPOSITORY,
        useExisting: TypeOrmTicketRepository,
      },
      {
        provide: TICKET_ID_GENERATOR,
        useValue: { generate: () => 'e2e-id-' + Math.random().toString(36).slice(2, 8) },
      },
      {
        provide: TICKET_USE_CASES,
        useFactory: (
          ticketIdGenerator: TicketIdGenerator,
          ticketRepository: TicketRepository,
        ): TicketService => new TicketService(ticketIdGenerator, ticketRepository),
        inject: [TICKET_ID_GENERATOR, TICKET_REPOSITORY],
      },
      CreateTicketCommand,
      ListTicketCommand,
      GetTicketCommand,
      EditTicketCommand,
    ],
  }).compile();

  const app = moduleRef.createNestApplication();
  await app.init();

  return { app, moduleRef };
}
