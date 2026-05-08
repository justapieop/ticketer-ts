import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmTicketSchema } from "./infra/TypeOrmTicket.schema";
import { TICKET_REPOSITORY } from "./app/Ticket.repository";
import { TypeOrmTicketRepository } from "./infra/TypeOrmTicket.repository";
import { TicketService } from "./Ticket.service";
import { CreateTicketCommand } from "./commands/CreateTicket.command";

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
  ],
})
export class TicketModule {}