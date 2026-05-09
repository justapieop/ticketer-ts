import { Inject, Injectable } from "@nestjs/common";
import { TICKET_REPOSITORY, type TicketRepository } from "./app/Ticket.repository";
import { CreateTicketDto, Ticket, TicketPriority, TicketStage } from "./domain/Ticket.domain";
import { nanoid } from "nanoid";

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

  public async setTicketTitle(id: string, title: string): Promise<void> {
    await this.ticketRepository.setTitle(id, title);
  }

  public async setTicketSubject(id: string, subject: string): Promise<void> {
    await this.ticketRepository.setSubject(id, subject);
  }

  public async setTicketPriority(id: string, priority: TicketPriority): Promise<void> {
    await this.ticketRepository.setPriority(id, priority);
  }
}