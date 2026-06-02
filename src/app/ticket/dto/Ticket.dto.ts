import { Ticket, TicketPriority, TicketStage } from "src/domain/ticket";

export class TicketDto {
  public constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly subject: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date | null,
    public readonly priority: TicketPriority,
    public readonly stage: TicketStage,
  ) {}

  public static fromEntity(ticket: Ticket): TicketDto {
    return new TicketDto(
      ticket.id,
      ticket.title,
      ticket.subject,
      ticket.createdAt,
      ticket.updatedAt,
      ticket.priority,
      ticket.stage,
    );
  }
}
