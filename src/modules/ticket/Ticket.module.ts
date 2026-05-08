import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmTicketSchema } from "./infra/TypeOrmTicket.schema";
import { TICKET_REPOSITORY } from "./app/Ticket.repository";
import { TypeOrmTicketRepository } from "./infra/TypeOrmTicket.repository";
import { TicketService } from "./Ticket.service";

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
  ],
})
export class TicketModule {}