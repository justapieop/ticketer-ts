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

const CLI_TICKET_PRIORITY_BY_NAME: Record<string, CliTicketPriority> = {
  standard: CliTicketPriority.Standard,
  priority: CliTicketPriority.Priority,
  urgent: CliTicketPriority.Urgent,
};

const CLI_TICKET_STAGE_BY_NAME: Record<string, CliTicketStage> = {
  created: CliTicketStage.Created,
  inprogress: CliTicketStage.InProgress,
  escalated: CliTicketStage.Escalated,
  resolving: CliTicketStage.Resolving,
  closed: CliTicketStage.Closed,
};

function normalizeCliToken(value: string): string {
  return value.trim().toLowerCase().replace(/[\s_-]/g, "");
}

export function parseCliTicketPriority(value: string): CliTicketPriority {
  const normalized = normalizeCliToken(value);
  const parsed = CLI_TICKET_PRIORITY_BY_NAME[normalized];

  if (parsed) {
    return parsed;
  }

  throw new Error(`Unknown CLI ticket priority: ${value}`);
}

export function parseCliTicketStage(value: string): CliTicketStage {
  const normalized = normalizeCliToken(value);
  const parsed = CLI_TICKET_STAGE_BY_NAME[normalized];

  if (parsed) {
    return parsed;
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
