import { Ticket } from "src/domain/ticket/Ticket.domain";
import { CreateTicketInput } from "src/domain/ticket/ports/inputs/CreateTicket.input";
import { EditTicketInput } from "src/domain/ticket/ports/inputs/EditTicket.input";

export const TICKET_USE_CASES = Symbol("TICKET_USE_CASES");

export interface TicketUseCases {
  createTicket(input: CreateTicketInput): Promise<Ticket>;
  editTicket(input: EditTicketInput): Promise<Ticket>;
  listTickets(): Promise<Ticket[]>;
  getTicketById(id: string): Promise<Ticket>;
}
