import { Ticket, TicketStage } from "../domain/Ticket.schema";

export const TICKET_REPOSITORY = Symbol("TICKET_REPOSITORY");

export interface TicketRepository {
  save(ticket: Ticket): Promise<Ticket>;
  getTicketById(id: string): Promise<Ticket | null>;
  listTicket(): Promise<Ticket[]>;
  setStage(id: string, stage: TicketStage): Promise<void>;
}