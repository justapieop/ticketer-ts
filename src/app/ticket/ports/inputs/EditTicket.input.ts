import { TicketPriority, TicketStage } from "src/domain/ticket";

export class EditTicketInput {
  public constructor(
    public readonly id: string,
    public readonly title?: string,
    public readonly subject?: string,
    public readonly priority?: TicketPriority,
    public readonly stage?: TicketStage,
  ) {}
}
