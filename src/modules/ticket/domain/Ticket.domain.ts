export class Ticket {
  public constructor(
    public readonly id: string,
    public title: string,
    public subject: string,
    public createdAt: Date,
    public updatedAt: Date | null,
    public priority: TicketPriority,
    public stage: TicketStage,
  ) { }
  
  public setTitle(title: string): Ticket {
    this.title = title;
    return this;
  }

  public setSubject(subject: string): Ticket {
    this.subject = subject;
    return this;
  }

  public setPriority(priority: TicketPriority): Ticket {
    this.priority = priority;
    return this;
  }

  public setStage(stage: TicketStage): Ticket {
    this.stage = stage;
    return this;
  }

  public setLastUpdateTime(): Ticket {
    this.updatedAt = new Date();
    return this;
  }

  public static parsePriority(priority: string): TicketPriority {
    return TicketPriority[priority as keyof typeof TicketPriority];
  }

  public static parseStage(stage: string): TicketStage {
    return TicketStage[stage as keyof typeof TicketStage];
  }
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
