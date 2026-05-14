import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TicketService } from "./Ticket.service";
import { TICKET_REPOSITORY } from "src/app/ticket/Ticket.repository";
import { TICKET_ID_GENERATOR } from "src/app/ticket/TicketId.generator";
import { CreateTicketCommand } from "src/infra/ticket/commands/CreateTicket.command";
import { EditTicketCommand } from "src/infra/ticket/commands/EditTicket.command";
import { GetTicketCommand } from "src/infra/ticket/commands/GetTicket.command";
import { ListTicketCommand } from "src/infra/ticket/commands/ListTicket.command";
import { NanoIdGenerator } from "src/infra/ticket/nanoid/NanoId.generator";
import { TypeOrmTicketRepository } from "src/infra/ticket/typeorm/TypeOrmTicket.repository";
import { TypeOrmTicketSchema } from "src/infra/ticket/typeorm/TypeOrmTicket.schema";

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