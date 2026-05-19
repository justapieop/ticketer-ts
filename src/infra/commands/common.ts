import { TicketPriority, TicketStage } from "src/domain/ticket/Ticket.domain";

export enum CliTicketPriority {
  Standard = "Standard",
  Priority = "Priority",
  Urgent = "Urgent",
}

export enum CliTicketStage {
  Created = "Created",
  InProgress = "InProgress",
  Escalated = "Escalated",
  Resolving = "Resolving",
  Closed = "Closed",
}

export const CLI_TICKET_PRIORITY_CHOICES = Object.values(CliTicketPriority);
export const CLI_TICKET_STAGE_CHOICES = Object.values(CliTicketStage);

export function parseCliTicketPriority(value: string): CliTicketPriority {
  if (CLI_TICKET_PRIORITY_CHOICES.includes(value as CliTicketPriority)) {
    return value as CliTicketPriority;
  }

  throw new Error(`Unknown CLI ticket priority: ${value}`);
}

export function parseCliTicketStage(value: string): CliTicketStage {
  if (CLI_TICKET_STAGE_CHOICES.includes(value as CliTicketStage)) {
    return value as CliTicketStage;
  }

  throw new Error(`Unknown CLI ticket stage: ${value}`);
}

export function toDomainPriority(priority: CliTicketPriority): TicketPriority {
  switch (priority) {
    case CliTicketPriority.Standard:
      return TicketPriority.Standard;
    case CliTicketPriority.Priority:
      return TicketPriority.Priority;
    case CliTicketPriority.Urgent:
      return TicketPriority.Urgent;
  }

  throw new Error(`Unknown CLI ticket priority: ${priority}`);
}

export function fromDomainPriority(priority: TicketPriority): CliTicketPriority {
  switch (priority) {
    case TicketPriority.Standard:
      return CliTicketPriority.Standard;
    case TicketPriority.Priority:
      return CliTicketPriority.Priority;
    case TicketPriority.Urgent:
      return CliTicketPriority.Urgent;
  }

  throw new Error(`Unknown ticket priority: ${priority}`);
}

export function toDomainStage(stage: CliTicketStage): TicketStage {
  switch (stage) {
    case CliTicketStage.Created:
      return TicketStage.Created;
    case CliTicketStage.InProgress:
      return TicketStage.InProgress;
    case CliTicketStage.Escalated:
      return TicketStage.Escalated;
    case CliTicketStage.Resolving:
      return TicketStage.Resolving;
    case CliTicketStage.Closed:
      return TicketStage.Closed;
  }

  throw new Error(`Unknown CLI ticket stage: ${stage}`);
}

export function fromDomainStage(stage: TicketStage): CliTicketStage {
  switch (stage) {
    case TicketStage.Created:
      return CliTicketStage.Created;
    case TicketStage.InProgress:
      return CliTicketStage.InProgress;
    case TicketStage.Escalated:
      return CliTicketStage.Escalated;
    case TicketStage.Resolving:
      return CliTicketStage.Resolving;
    case TicketStage.Closed:
      return CliTicketStage.Closed;
  }

  throw new Error(`Unknown ticket stage: ${stage}`);
}
