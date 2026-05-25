import { InvalidTicketDataError } from "./exceptions/InvalidTicketData.error";
import { TicketEditor } from "./TicketEditor";
import { TicketPriority } from "./TicketPriority.enum";
import { TicketStage } from "./TicketStage.enum";

export { TicketPriority } from "./TicketPriority.enum";
export { TicketStage } from "./TicketStage.enum";
export { TicketEditor } from "./TicketEditor";

export class Ticket {
  private constructor(
    public readonly id: string,
    public title: string,
    public subject: string,
    public createdAt: Date,
    public updatedAt: Date | null,
    public priority: TicketPriority,
    public stage: TicketStage,
  ) {
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

  public changeTitle(title: string): void {
    this.title = title;
    this.updatedAt = new Date();
  }

  public changeSubject(subject: string): void {
    this.subject = subject;
    this.updatedAt = new Date();
  }

  public changePriority(priority: TicketPriority): void {
    this.priority = priority;
    this.updatedAt = new Date();
  }

  public changeStage(stage: TicketStage): void {
    Ticket.validateStageTransition(this.stage, stage);
    this.stage = stage;
    this.updatedAt = new Date();
  }

  public edit(): TicketEditor {
    return new TicketEditor(this);
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
