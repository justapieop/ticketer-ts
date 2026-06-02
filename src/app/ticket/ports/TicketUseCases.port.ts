import { TicketPriority, TicketStage } from "src/domain/ticket";
import { TicketDto } from "../dto/Ticket.dto";
import { CreateTicketInput } from "./inputs/CreateTicket.input";

export const TICKET_USE_CASES = Symbol("TICKET_USE_CASES");

export interface TicketUseCases {
  createTicket(input: CreateTicketInput): Promise<TicketDto>;
  reviseTicketContent(id: string, title: string, subject: string): Promise<TicketDto>;
  changeTicketPriority(id: string, priority: TicketPriority): Promise<TicketDto>;
  advanceTicketStage(id: string, stage: TicketStage): Promise<TicketDto>;
  listTickets(): Promise<TicketDto[]>;
  getTicketById(id: string): Promise<TicketDto>;
}
