import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmTicketSchema } from "./infra/TypeOrmTicket.schema";
import { TICKET_REPOSITORY } from "./application/Ticket.repository";
import { TypeOrmTicketRepository } from "./infra/TypeOrmTicket.repository";
import { TicketService } from "./Ticket.service";
import { CreateTicketCommand } from "./commands/CreateTicket.command";
import { ListTicketCommand } from "./commands/ListTicket.command";
import { GetTicketCommand } from "./commands/GetTicket.command";
import { EditTicketCommand } from "./commands/EditTicket.command";

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
    TicketService,
    CreateTicketCommand,
    ListTicketCommand,
    GetTicketCommand,
    EditTicketCommand,
  ],
})
export class TicketModule {}