import { Ticket } from "src/domain/ticket/Ticket.domain";
import { CreateTicketInput } from "./inputs/CreateTicket.input";
import { EditTicketInput } from "./inputs/EditTicket.input";

export const TICKET_USE_CASES = Symbol("TICKET_USE_CASES");

export interface TicketUseCases {
  createTicket(input: CreateTicketInput): Promise<Ticket>;
  editTicket(input: EditTicketInput): Promise<Ticket>;
  listTickets(): Promise<Ticket[]>;
  getTicketById(id: string): Promise<Ticket>;
}
