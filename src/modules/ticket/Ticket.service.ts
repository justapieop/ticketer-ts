import { Inject, Injectable } from "@nestjs/common";
import { Ticket, TicketPriority, TicketStage } from "../../domain/ticket/Ticket.domain";
import { TICKET_REPOSITORY, type TicketRepository } from "src/app/ticket/Ticket.repository";
import { TICKET_ID_GENERATOR, type TicketIdGenerator } from "src/app/ticket/TicketId.generator";

@Injectable()
export class TicketService {
  public constructor(
    @Inject(TICKET_ID_GENERATOR)
    private readonly ticketIdGenerator: TicketIdGenerator,
    @Inject(TICKET_REPOSITORY)
    private readonly ticketRepository: TicketRepository,
  ) {}

  public async createTicket(title: string, subject: string, priority: TicketPriority = TicketPriority.Standard): Promise<Ticket> {
    const ticket: Ticket = new Ticket(
      this.ticketIdGenerator.generate(),
      title,
      subject,
      new Date(),
      null,
      priority,
      TicketStage.Created,
    );

    await this.ticketRepository.save(ticket);

    return ticket;
  }

  public async saveTicket(ticket: Ticket): Promise<void> {
    await this.ticketRepository.save(ticket);
  }

  public async listTickets(): Promise<Ticket[]> {
    return await this.ticketRepository.listTicket();
  }

  public async getTicketById(id: string): Promise<Ticket | null> {
    return await this.ticketRepository.getTicketById(id);
  }
}