import { Ticket, TicketPriority, TicketStage } from "src/domain/ticket";
import { TicketNotFoundError } from "src/app/ticket/exceptions/TicketNotFound.error";
import { CreateTicketInput } from "./ports/inputs/CreateTicket.input";
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

  public async reviseTicketContent(id: string, title: string, subject: string): Promise<Ticket> {
    const ticket = await this.findTicketOrFail(id);

    ticket.changeTitle(title);
    ticket.changeSubject(subject);

    await this.ticketRepository.save(ticket);

    return ticket;
  }

  public async changeTicketPriority(id: string, priority: TicketPriority): Promise<Ticket> {
    const ticket = await this.findTicketOrFail(id);

    ticket.changePriority(priority);

    await this.ticketRepository.save(ticket);

    return ticket;
  }

  public async advanceTicketStage(id: string, stage: TicketStage): Promise<Ticket> {
    const ticket = await this.findTicketOrFail(id);

    ticket.changeStage(stage);

    await this.ticketRepository.save(ticket);

    return ticket;
  }

  public async listTickets(): Promise<Ticket[]> {
    return await this.ticketRepository.listTicket();
  }

  public async getTicketById(id: string): Promise<Ticket> {
    return await this.findTicketOrFail(id);
  }

  private async findTicketOrFail(id: string): Promise<Ticket> {
    const ticket = await this.ticketRepository.getTicketById(id);

    if (!ticket) {
      throw new TicketNotFoundError(id);
    }

    return ticket;
  }
}
