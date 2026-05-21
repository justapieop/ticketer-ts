import { Ticket } from "./Ticket.domain";
import { InvalidTicketDataError } from "./exceptions/InvalidTicketData.error";
import { TicketPriority } from "./TicketPriority.enum";
import { TicketStage } from "./TicketStage.enum";

export class TicketEditor {
  public constructor(
    private readonly ticket: Ticket,
  ) {}

  public setTitle(title: string): TicketEditor {
    if (!title.trim()) {
      throw new InvalidTicketDataError("Title cannot be empty.");
    }
    this.ticket.changeTitle(title);
    return this;
  }

  public setSubject(subject: string): TicketEditor {
    if (!subject.trim()) {
      throw new InvalidTicketDataError("Subject cannot be empty.");
    }
    this.ticket.changeSubject(subject);
    return this;
  }

  public setPriority(priority: TicketPriority): TicketEditor {
    this.ticket.changePriority(priority);
    return this;
  }

  public setStage(stage: TicketStage): TicketEditor {
    this.ticket.changeStage(stage);
    return this;
  }
}
