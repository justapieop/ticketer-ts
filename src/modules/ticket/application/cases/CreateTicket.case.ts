import { Injectable, Inject } from "@nestjs/common";
import { Ticket } from "../../domain/Ticket.domain";
import { TICKET_REPOSITORY, type TicketRepository } from "../Ticket.repository";
import { nanoid } from "nanoid";
import { CreateTicketDto } from "../dtos/CreateTicket.dto";

@Injectable()
export class CreateTicketUseCase {
  public constructor(
    @Inject(TICKET_REPOSITORY)
    private readonly ticketRepository: TicketRepository,
  ) {}

  public async execute(dto: CreateTicketDto): Promise<Ticket> {
    const ticket = new Ticket(
      nanoid(16),
      dto.title,
      dto.subject,
      new Date(),
      null,
      dto.priority,
      dto.stage,
    );
    return await this.ticketRepository.save(ticket);
  }
}
