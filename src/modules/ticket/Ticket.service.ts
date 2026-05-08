import { Inject, Injectable } from "@nestjs/common";
import { TICKET_REPOSITORY, type TicketRepository } from "./app/Ticket.repository";
import { Ticket } from "./domain/Ticket.schema";

@Injectable()
export class TicketService {
  public constructor(
    @Inject(TICKET_REPOSITORY)
    private readonly ticketRepository: TicketRepository,
  ) { }
  
  public async createTicket(ticket: Ticket): Promise<Ticket> {
    return await this.ticketRepository.save(ticket);
  }

  public async getTicketById(id: string): Promise<Ticket | null> {
    return await this.ticketRepository.getTicketById(id);
  }

  public async listTicket(): Promise<Ticket[]> {
    return await this.ticketRepository.listTicket();
  }
}