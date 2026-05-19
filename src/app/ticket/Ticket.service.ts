import { Ticket } from "src/domain/ticket/Ticket.domain";
import { TicketNotFoundError } from "src/domain/ticket/exceptions/TicketNotFound.error";
import { type TicketRepository } from "src/domain/ticket/ports/TicketRepository.port";
import { type TicketIdGenerator } from "src/domain/ticket/ports/TicketIdGenerator.port";
import { CreateTicketInput } from "src/app/ticket/inputs/CreateTicket.input";
import { EditTicketInput } from "src/app/ticket/inputs/EditTicket.input";
import { type TicketUseCases } from "src/app/ticket/ports/TicketUseCases.port";

export class TicketService implements TicketUseCases {
  public constructor(
    private readonly ticketIdGenerator: TicketIdGenerator,
    private readonly ticketRepository: TicketRepository,
  ) {}

  public async createTicket(input: CreateTicketInput): Promise<Ticket> {
    const ticket = Ticket.create(
      this.ticketIdGenerator.generate(),
      input.title,
      input.subject,
      input.priority,
    );

    await this.ticketRepository.save(ticket);

    return ticket;
  }

  public async editTicket(input: EditTicketInput): Promise<Ticket> {
    const ticket: Ticket | null = await this.ticketRepository.getTicketById(input.id);

    if (!ticket) {
      throw new TicketNotFoundError(input.id);
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

  public async getTicketById(id: string): Promise<Ticket> {
    const ticket = await this.ticketRepository.getTicketById(id);

    if (!ticket) {
      throw new TicketNotFoundError(id);
    }

    return ticket;
  }
}
