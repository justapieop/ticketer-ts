import { Injectable, Inject } from "@nestjs/common";
import { Ticket } from "../../domain/Ticket.domain";
import { TICKET_REPOSITORY, type TicketRepository } from "../Ticket.repository";

@Injectable()
export class ListTicketsUseCase {
  constructor(
    @Inject(TICKET_REPOSITORY)
    private readonly ticketRepository: TicketRepository,
  ) {}

  async execute(): Promise<Ticket[]> {
    return await this.ticketRepository.listTicket();
  }
}
