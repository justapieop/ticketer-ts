import { Inject, Injectable } from "@nestjs/common";
import { TICKET_REPOSITORY, type TicketRepository } from "./app/Ticket.repository";
import { Ticket, TicketPriority, TicketStage } from "./domain/Ticket.domain";
import { nanoid } from "nanoid";

export interface CreateTicketDto {
  title: string;
  subject: string;
  priority: TicketPriority;
  stage: TicketStage;
}

@Injectable()
export class TicketService {
  public constructor(
    @Inject(TICKET_REPOSITORY)
    private readonly ticketRepository: TicketRepository,
  ) { }
  
  public async createTicket(dto: CreateTicketDto): Promise<Ticket> {
    const ticket = new Ticket(
      nanoid(16),
      dto.title,
      dto.subject,
      new Date(),
      null,
      dto.priority,
      dto.stage
    );
    return await this.ticketRepository.save(ticket);
  }

  public async getTicketById(id: string): Promise<Ticket | null> {
    return await this.ticketRepository.getTicketById(id);
  }

  public async listTicket(): Promise<Ticket[]> {
    return await this.ticketRepository.listTicket();
  }

  public async setTicketStage(id: string, stage: TicketStage): Promise<void> {
    await this.ticketRepository.setStage(id, stage);
  }
}