import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TICKET_ID_GENERATOR, TicketIdGenerator } from "src/app/ticket/ports/TicketIdGenerator.port";
import { TICKET_REPOSITORY, TicketRepository } from "src/app/ticket/ports/TicketRepository.port";
import { TICKET_USE_CASES } from "src/app/ticket/ports/TicketUseCases.port";
import { TicketService } from "src/app/ticket/Ticket.service";
import { CreateTicketCommand } from "src/infra/commands/ticket/CreateTicket.command";
import { EditTicketCommand } from "src/infra/commands/ticket/EditTicket.command";
import { GetTicketCommand } from "src/infra/commands/ticket/GetTicket.command";
import { ListTicketCommand } from "src/infra/commands/ticket/ListTicket.command";
import { NanoIdGenerator } from "src/infra/nanoid/NanoId.generator";
import { TypeOrmTicketRepository } from "src/infra/typeorm/TypeOrmTicket.repository";
import { TypeOrmTicketSchema } from "src/infra/typeorm/TypeOrmTicket.schema";

@Module({
  imports: [
    TypeOrmModule.forFeature([TypeOrmTicketSchema]),
  ],
  providers: [
    TypeOrmTicketRepository,
    {
      provide: TICKET_REPOSITORY,
      useExisting: TypeOrmTicketRepository,
    },
    NanoIdGenerator,
    {
      provide: TICKET_ID_GENERATOR,
      useExisting: NanoIdGenerator,
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
})
export class TicketModule {}
