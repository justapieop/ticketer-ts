import { Ticket, TicketPriority, TicketStage } from "src/domain/ticket";
import { CreateTicketInput } from "./inputs/CreateTicket.input";

export const TICKET_USE_CASES = Symbol("TICKET_USE_CASES");

export interface TicketUseCases {
  createTicket(input: CreateTicketInput): Promise<Ticket>;
  reviseTicketContent(id: string, title: string, subject: string): Promise<Ticket>;
  changeTicketPriority(id: string, priority: TicketPriority): Promise<Ticket>;
  advanceTicketStage(id: string, stage: TicketStage): Promise<Ticket>;
  listTickets(): Promise<Ticket[]>;
  getTicketById(id: string): Promise<Ticket>;
}
