import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TICKET_REPOSITORY, type TicketRepository } from "src/domain/ticket/ports/TicketRepository.port";
import { TicketService } from "src/app/ticket/Ticket.service";
import { TICKET_ID_GENERATOR, type TicketIdGenerator } from "src/domain/ticket/ports/TicketIdGenerator.port";
import { TICKET_USE_CASES } from "src/app/ticket/ports/TicketUseCases.port";
import { CreateTicketCommand } from "src/infra/commands/CreateTicket.command";
import { EditTicketCommand } from "src/infra/commands/EditTicket.command";
import { GetTicketCommand } from "src/infra/commands/GetTicket.command";
import { ListTicketCommand } from "src/infra/commands/ListTicket.command";
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
