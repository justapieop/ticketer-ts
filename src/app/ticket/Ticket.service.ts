import { Ticket, TicketPriority, TicketStage } from "src/domain/ticket/Ticket.domain";
import { type TicketRepository } from "src/app/ticket/Ticket.repository";
import { type TicketIdGenerator } from "src/app/ticket/TicketId.generator";

export class TicketService {
  public constructor(
    private readonly ticketIdGenerator: TicketIdGenerator,
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
