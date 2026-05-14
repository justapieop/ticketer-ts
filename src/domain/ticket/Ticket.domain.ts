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
  
  public setTitle(title: string): Ticket {
    this.title = title;
    this.setLastUpdateTime();
    return this;
  }

  public setSubject(subject: string): Ticket {
    this.subject = subject;
    this.setLastUpdateTime();
    return this;
  }

  public setPriority(priority: TicketPriority): Ticket {
    this.priority = priority;
    this.setLastUpdateTime();
    return this;
  }

  public setStage(stage: TicketStage): Ticket {
    Ticket.validateStageTransition(this.stage, stage);
    this.stage = stage;
    this.setLastUpdateTime();
    return this;
  }

  public setLastUpdateTime(): Ticket {
    this.updatedAt = new Date();
    return this;
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
