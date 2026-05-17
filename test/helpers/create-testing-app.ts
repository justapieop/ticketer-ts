import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmTicketSchema } from 'src/infra/ticket/typeorm/TypeOrmTicket.schema';
import { TypeOrmTicketRepository } from 'src/infra/ticket/typeorm/TypeOrmTicket.repository';
import { TICKET_REPOSITORY } from 'src/app/ticket/Ticket.repository';
import { TICKET_ID_GENERATOR } from 'src/app/ticket/TicketId.generator';
import { TicketService } from 'src/modules/ticket/Ticket.service';
import { CreateTicketCommand } from 'src/infra/ticket/commands/CreateTicket.command';
import { ListTicketCommand } from 'src/infra/ticket/commands/ListTicket.command';
import { GetTicketCommand } from 'src/infra/ticket/commands/GetTicket.command';
import { EditTicketCommand } from 'src/infra/ticket/commands/EditTicket.command';

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
      // Provide a simple deterministic ID generator for tests
      {
        provide: TICKET_ID_GENERATOR,
        useValue: { generate: () => 'e2e-id-' + Math.random().toString(36).slice(2, 8) },
      },
      TicketService,
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
