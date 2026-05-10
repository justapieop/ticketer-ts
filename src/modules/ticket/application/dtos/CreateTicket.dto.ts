import { TicketPriority, TicketStage } from "../../domain/Ticket.domain";

export class CreateTicketDto {
  constructor(
    public readonly title: string,
    public readonly subject: string,
    public readonly priority: TicketPriority,
    public readonly stage: TicketStage,
  ) {}
}