import { Ticket, TicketPriority, TicketStage } from "src/domain/ticket/Ticket.domain";
import { type TicketRepository } from "src/app/ticket/Ticket.repository";
import { type TicketIdGenerator } from "src/app/ticket/TicketId.generator";
import { CreateTicketInput } from "src/app/ticket/inputs/CreateTicket.input";
import { EditTicketInput } from "src/app/ticket/inputs/EditTicket.input";

export class TicketService {
  public constructor(
    private readonly ticketIdGenerator: TicketIdGenerator,
    private readonly ticketRepository: TicketRepository,
  ) {}

  public async createTicket(input: CreateTicketInput): Promise<Ticket> {
    const ticket: Ticket = new Ticket(
      this.ticketIdGenerator.generate(),
      input.title,
      input.subject,
      new Date(),
      null,
      input.priority ?? TicketPriority.Standard,
      TicketStage.Created,
    );

    await this.ticketRepository.save(ticket);

    return ticket;
  }

  public async saveTicket(ticket: Ticket): Promise<void> {
    await this.ticketRepository.save(ticket);
  }

  public async editTicket(input: EditTicketInput): Promise<Ticket | null> {
    const ticket: Ticket | null = await this.ticketRepository.getTicketById(input.id);

    if (!ticket) {
      return null;
    }

    const editor = ticket.edit();

    if (input.title !== undefined) {
      editor.setTitle(input.title);
    }

    if (input.subject !== undefined) {
      editor.setSubject(input.subject);
    }

    if (input.priority !== undefined) {
      editor.setPriority(input.priority);
    }

    if (input.stage !== undefined) {
      editor.setStage(input.stage);
    }

    await this.ticketRepository.save(ticket);

    return ticket;
  }

  public async listTickets(): Promise<Ticket[]> {
    return await this.ticketRepository.listTicket();
  }

  public async getTicketById(id: string): Promise<Ticket | null> {
    return await this.ticketRepository.getTicketById(id);
  }
}
