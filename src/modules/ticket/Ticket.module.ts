import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmTicketSchema } from "./infra/TypeOrmTicket.schema";
import { TICKET_REPOSITORY } from "./application/Ticket.repository";
import { TypeOrmTicketRepository } from "./infra/TypeOrmTicket.repository";
import { CreateTicketCommand } from "./infra/commands/CreateTicket.command";
import { ListTicketCommand } from "./infra/commands/ListTicket.command";
import { GetTicketCommand } from "./infra/commands/GetTicket.command";
import { EditTicketCommand } from "./infra/commands/EditTicket.command";
import { CreateTicketUseCase } from "./application/cases/CreateTicket.case";
import { GetTicketUseCase } from "./application/cases/GetTicket.case";
import { ListTicketsUseCase } from "./application/cases/ListTickets.case";
import { UpdateTicketUseCase } from "./application/cases/UpdateTicket.case";

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
    CreateTicketUseCase,
    GetTicketUseCase,
    ListTicketsUseCase,
    UpdateTicketUseCase,
    CreateTicketCommand,
    ListTicketCommand,
    GetTicketCommand,
    EditTicketCommand,
  ],
})
export class TicketModule {}