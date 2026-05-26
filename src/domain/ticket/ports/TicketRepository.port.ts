import { Ticket } from "src/domain/ticket/Ticket.domain";

export const TICKET_REPOSITORY = Symbol("TICKET_REPOSITORY");

export interface TicketRepository {
  save(ticket: Ticket): Promise<Ticket>;
  getTicketById(id: string): Promise<Ticket | null>;
  listTicket(): Promise<Ticket[]>;
}
