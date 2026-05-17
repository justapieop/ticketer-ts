import { InvalidPriorityInput } from "./exceptions/InvalidPriorityInput.error";
import { InvalidStageInput } from "./exceptions/InvalidStageInput.error";
import { InvalidTicketDataError } from "./exceptions/InvalidTicketData.error";

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

  public static parsePriority(priority: string): TicketPriority {
    switch (priority.toLowerCase()) {
      case "standard": {
        return TicketPriority.Standard;
      }
      
      case "priority": {
        return TicketPriority.Priority;
      }
      
      case "urgent": {
        return TicketPriority.Urgent;
      }
        
      default: {
        throw new InvalidPriorityInput(priority);
      }
    }
  }

  public static parseStage(stage: string): TicketStage {
    switch (stage.toLowerCase()) {
      case "created": {
        return TicketStage.Created;
      }
        
      case "inprogress": {
        return TicketStage.InProgress;
      }
        
      case "escalated": {
        return TicketStage.Escalated;
      }
        
      case "resolving": {
        return TicketStage.Resolving;
      }
        
      case "closed": {
        return TicketStage.Closed;
      }

      default: {
        throw new InvalidStageInput(stage);
      }
    }
  }
}

export class TicketEditor {
  public constructor(
    private readonly ticket: Ticket,
  ) {}

  public setTitle(title: string): TicketEditor {
    this.ticket.title = title;
    this.touch();
    return this;
  }

  public setSubject(subject: string): TicketEditor {
    this.ticket.subject = subject;
    this.touch();
    return this;
  }

  public setPriority(priority: TicketPriority): TicketEditor {
    this.ticket.priority = priority;
    this.touch();
    return this;
  }

  public setStage(stage: TicketStage): TicketEditor {
    Ticket.validateStageTransition(this.ticket.stage, stage);
    this.ticket.stage = stage;
    this.touch();
    return this;
  }

  private touch(): void {
    this.ticket.updatedAt = new Date();
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
