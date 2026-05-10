import { Injectable, Inject } from "@nestjs/common";
import { TICKET_REPOSITORY, type TicketRepository } from "../Ticket.repository";
import { UpdateTicketDto } from "../dtos/UpdateTicket.dto";
import { TicketNotFoundError } from "../../domain/exceptions/TicketNotFound.error";

@Injectable()
export class UpdateTicketUseCase {
  public constructor(
    @Inject(TICKET_REPOSITORY)
    private readonly ticketRepository: TicketRepository,
  ) {}

  public async execute(dto: UpdateTicketDto): Promise<void> {
    const ticket = await this.ticketRepository.getTicketById(dto.id);
    if (!ticket) {
      throw new TicketNotFoundError(dto.id);
    }

    if (dto.title !== undefined) {
      await this.ticketRepository.setTitle(dto.id, dto.title);
    }

    if (dto.subject !== undefined) {
      await this.ticketRepository.setSubject(dto.id, dto.subject);
    }

    if (dto.priority !== undefined) {
      await this.ticketRepository.setPriority(dto.id, dto.priority);
    }

    if (dto.stage !== undefined) {
      await this.ticketRepository.setStage(dto.id, dto.stage);
    }
  }
}
