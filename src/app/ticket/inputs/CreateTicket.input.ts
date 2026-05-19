import { TicketPriority } from "src/domain/ticket/Ticket.domain";

export class CreateTicketInput {
  public constructor(
    public readonly title: string,
    public readonly subject: string,
    public readonly priority?: TicketPriority,
  ) {}
}
