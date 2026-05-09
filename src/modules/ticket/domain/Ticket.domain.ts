export class CreateTicketDto {
  public constructor(
    public readonly title: string,
    public readonly subject: string,
    public readonly priority: TicketPriority,
    public readonly stage: TicketStage,
  ) {}
}

export class Ticket {
  public constructor(
    public readonly id: string,
    public title: string,
    public subject: string,
    public createdAt: Date,
    public updatedAt: Date | null,
    public priority: TicketPriority,
    public stage: TicketStage,
  ) {}
}

export enum TicketPriority {
  Standard,
  Priority,
  Urgent,
}

export enum TicketStage {
  Created,
  InProgress,
  Escalated,
  Resolving,
  Closed,
}
