import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmTicketSchema } from "./infra/typeorm/TypeOrmTicket.schema";
import { TICKET_REPOSITORY } from "./application/Ticket.repository";
import { TypeOrmTicketRepository } from "./infra/typeorm/TypeOrmTicket.repository";
import { CreateTicketCommand } from "./infra/commands/CreateTicket.command";
import { ListTicketCommand } from "./infra/commands/ListTicket.command";
import { GetTicketCommand } from "./infra/commands/GetTicket.command";
import { EditTicketCommand } from "./infra/commands/EditTicket.command";
import { NanoIdGenerator } from "./infra/nanoid/NanoId.generator";
import { TICKET_ID_GENERATOR } from "./application/TicketId.generator";
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
    NanoIdGenerator,
    {
      provide: TICKET_ID_GENERATOR,
      useExisting: NanoIdGenerator,
    },
    TicketService,
    CreateTicketCommand,
    ListTicketCommand,
    GetTicketCommand,
    EditTicketCommand,
  ],
})
export class TicketModule {}