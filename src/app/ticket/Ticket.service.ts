import { Ticket, TicketPriority, TicketStage } from "src/domain/ticket";
import { TicketNotFoundError } from "src/app/ticket/exceptions/TicketNotFound.error";
import { TicketDto } from "./dto/Ticket.dto";
import { CreateTicketInput } from "./ports/inputs/CreateTicket.input";
import { TicketIdGenerator } from "./ports/TicketIdGenerator.port";
import { TicketRepository } from "./ports/TicketRepository.port";
import { TicketUseCases } from "./ports/TicketUseCases.port";

export class TicketService implements TicketUseCases {
  public constructor(
    private readonly ticketIdGenerator: TicketIdGenerator,
    private readonly ticketRepository: TicketRepository,
  ) {}

  public async createTicket(input: CreateTicketInput): Promise<TicketDto> {
    const ticket = Ticket.create(
      this.ticketIdGenerator.generate(),
      input.title,
      input.subject,
      input.priority,
    );

    await this.ticketRepository.save(ticket);

    return TicketDto.fromEntity(ticket);
  }

  public async reviseTicketContent(id: string, title: string, subject: string): Promise<TicketDto> {
    const ticket = await this.findTicketOrFail(id);

    ticket.changeTitle(title);
    ticket.changeSubject(subject);

    await this.ticketRepository.save(ticket);

    return TicketDto.fromEntity(ticket);
  }

  public async changeTicketPriority(id: string, priority: TicketPriority): Promise<TicketDto> {
    const ticket = await this.findTicketOrFail(id);

    ticket.changePriority(priority);

    await this.ticketRepository.save(ticket);

    return TicketDto.fromEntity(ticket);
  }

  public async advanceTicketStage(id: string, stage: TicketStage): Promise<TicketDto> {
    const ticket = await this.findTicketOrFail(id);

    ticket.changeStage(stage);

    await this.ticketRepository.save(ticket);

    return TicketDto.fromEntity(ticket);
  }

  public async listTickets(): Promise<TicketDto[]> {
    const tickets = await this.ticketRepository.listTicket();
    return tickets.map(TicketDto.fromEntity);
  }

  public async getTicketById(id: string): Promise<TicketDto> {
    const ticket = await this.findTicketOrFail(id);
    return TicketDto.fromEntity(ticket);
  }

  private async findTicketOrFail(id: string): Promise<Ticket> {
    const ticket = await this.ticketRepository.getTicketById(id);

    if (!ticket) {
      throw new TicketNotFoundError(id);
    }

    return ticket;
  }
}
