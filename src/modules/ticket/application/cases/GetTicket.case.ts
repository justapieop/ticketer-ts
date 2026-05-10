import { Injectable, Inject } from "@nestjs/common";
import { Ticket } from "../../domain/Ticket.domain";
import { TICKET_REPOSITORY, type TicketRepository } from "../Ticket.repository";
import { TicketNotFoundError } from "../../domain/exceptions/TicketNotFound.error";

@Injectable()
export class GetTicketUseCase {
  public constructor(
    @Inject(TICKET_REPOSITORY)
    private readonly ticketRepository: TicketRepository,
  ) {}

  public async execute(id: string): Promise<Ticket> {
    const ticket = await this.ticketRepository.getTicketById(id);
    if (!ticket) {
      throw new TicketNotFoundError(id);
    }
    return ticket;
  }
}
