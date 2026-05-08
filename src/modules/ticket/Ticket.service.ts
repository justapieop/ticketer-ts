import { Inject, Injectable } from "@nestjs/common";
import { TICKET_REPOSITORY, type TicketRepository } from "./app/Ticket.repository";

@Injectable()
export class TicketService {
  public constructor(
    @Inject(TICKET_REPOSITORY)
    private readonly ticketRepository: TicketRepository,
  ) { }
  
  
}