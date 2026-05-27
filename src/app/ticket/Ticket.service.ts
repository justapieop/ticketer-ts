import { Ticket } from "src/domain/ticket/Ticket.domain";
import { TicketNotFoundError } from "src/app/ticket/exceptions/TicketNotFound.error";
import { CreateTicketInput } from "./ports/inputs/CreateTicket.input";
import { EditTicketInput } from "./ports/inputs/EditTicket.input";
import { TicketIdGenerator } from "./ports/TicketIdGenerator.port";
import { TicketRepository } from "./ports/TicketRepository.port";
import { TicketUseCases } from "./ports/TicketUseCases.port";

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

    if (input.title !== undefined) {
      ticket.changeTitle(input.title);
    }

    if (input.subject !== undefined) {
      ticket.changeSubject(input.subject);
    }

    if (input.priority !== undefined) {
      ticket.changePriority(input.priority);
    }

    if (input.stage !== undefined) {
      ticket.changeStage(input.stage);
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
