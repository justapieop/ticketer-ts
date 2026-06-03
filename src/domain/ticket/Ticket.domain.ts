import { InvalidTicketDataError } from "./exceptions/InvalidTicketData.error";
import { TicketPriority } from "./TicketPriority.enum";
import { TicketStage } from "./TicketStage.enum";

export interface TicketProps {
  title: string;
  subject: string;
  createdAt: Date;
  updatedAt: Date | null;
  priority: TicketPriority;
  stage: TicketStage;
}

export class Ticket {
  private constructor(
    public readonly id: string,
    private props: TicketProps,
  ) {}

  get title() { return this.props.title; }
  get subject() { return this.props.subject; }
  get createdAt() { return this.props.createdAt; }
  get updatedAt() { return this.props.updatedAt; }
  get priority() { return this.props.priority; }
  get stage() { return this.props.stage; }

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
    return new Ticket(id, {
      title,
      subject,
      createdAt: new Date(),
      updatedAt: null,
      priority,
      stage: TicketStage.Created,
    });
  }

  public static reconstitute(id: string, props: TicketProps): Ticket {
    return new Ticket(id, props);
  }

  public changeTitle(title: string): void {
    if (!title.trim()) {
      throw new InvalidTicketDataError("Title cannot be empty.");
    }
    this.props.title = title;
    this.props.updatedAt = new Date();
  }

  public changeSubject(subject: string): void {
    if (!subject.trim()) {
      throw new InvalidTicketDataError("Subject cannot be empty.");
    }
    this.props.subject = subject;
    this.props.updatedAt = new Date();
  }

  public changePriority(priority: TicketPriority): void {
    this.props.priority = priority;
    this.props.updatedAt = new Date();
  }

  public changeStage(stage: TicketStage): void {
    Ticket.validateStageTransition(this.props.stage, stage);
    this.props.stage = stage;
    this.props.updatedAt = new Date();
  }

  private static validateStageTransition(from: TicketStage, to: TicketStage): void {
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
