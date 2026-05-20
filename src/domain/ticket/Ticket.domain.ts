import { InvalidTicketDataError } from "./exceptions/InvalidTicketData.error";

export class Ticket {
  private _title: string;
  private _subject: string;
  private _createdAt: Date;
  private _updatedAt: Date | null;
  private _priority: TicketPriority;
  private _stage: TicketStage;

  private constructor(
    public readonly id: string,
    title: string,
    subject: string,
    createdAt: Date,
    updatedAt: Date | null,
    priority: TicketPriority,
    stage: TicketStage,
  ) {
    this._title = title;
    this._subject = subject;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._priority = priority;
    this._stage = stage;
  }


  public static create(
    id: string,
    title: string,
    subject: string,
    priority: TicketPriority = TicketPriority.Standard,
  ): Ticket {
    if (!title.trim()) {
      throw new InvalidTicketDataError("Title cannot be empty.");
    }
    if (!subject.trim()) {
      throw new InvalidTicketDataError("Subject cannot be empty.");
    }
    return new Ticket(id, title, subject, new Date(), null, priority, TicketStage.Created);
  }


  public static reconstitute(
    id: string,
    title: string,
    subject: string,
    createdAt: Date,
    updatedAt: Date | null,
    priority: TicketPriority,
    stage: TicketStage,
  ): Ticket {
    return new Ticket(id, title, subject, createdAt, updatedAt, priority, stage);
  }



  get title(): string { return this._title; }
  get subject(): string { return this._subject; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date | null { return this._updatedAt; }
  get priority(): TicketPriority { return this._priority; }
  get stage(): TicketStage { return this._stage; }



  public changeTitle(title: string): void {
    if (!title.trim()) {
      throw new InvalidTicketDataError("Title cannot be empty.");
    }
    this._title = title;
    this._updatedAt = new Date();
  }

  public changeSubject(subject: string): void {
    if (!subject.trim()) {
      throw new InvalidTicketDataError("Subject cannot be empty.");
    }
    this._subject = subject;
    this._updatedAt = new Date();
  }

  public changePriority(priority: TicketPriority): void {
    this._priority = priority;
    this._updatedAt = new Date();
  }

  public changeStage(stage: TicketStage): void {
    Ticket.validateStageTransition(this._stage, stage);
    this._stage = stage;
    this._updatedAt = new Date();
  }

  public static validateStageTransition(from: TicketStage, to: TicketStage): void {
    if (from === to) {
      return;
    }

    const allowed: Record<TicketStage, TicketStage[]> = {
      [TicketStage.Created]: [TicketStage.InProgress],
      [TicketStage.InProgress]: [TicketStage.Escalated, TicketStage.Resolving],
      [TicketStage.Escalated]: [TicketStage.Resolving],
      [TicketStage.Resolving]: [TicketStage.Closed],
      [TicketStage.Closed]: [],
    };

    if (!allowed[from]?.includes(to)) {
      throw new InvalidTicketDataError("Invalid ticket stage transition.");
    }
  }
}

export enum TicketPriority {
  Standard = "Standard",
  Priority = "Priority",
  Urgent = "Urgent",
}

export enum TicketStage {
  Created = "Created",
  InProgress = "InProgress",
  Escalated = "Escalated",
  Resolving = "Resolving",
  Closed = "Closed",
}
