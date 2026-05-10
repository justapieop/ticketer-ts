import { Ticket, TicketPriority, TicketStage } from "../domain/Ticket.domain";

export const TICKET_REPOSITORY = Symbol("TICKET_REPOSITORY");

export interface TicketRepository {
  save(ticket: Ticket): Promise<Ticket>;
  getTicketById(id: string): Promise<Ticket | null>;
  listTicket(): Promise<Ticket[]>;
  setStage(id: string, stage: TicketStage): Promise<void>;
  setTitle(id: string, title: string): Promise<void>;
  setSubject(id: string, subject: string): Promise<void>;
  setPriority(id: string, priority: TicketPriority): Promise<void>;
}