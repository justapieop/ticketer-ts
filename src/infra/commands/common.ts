import { TicketPriority, TicketStage } from "src/domain/ticket";

export const TICKET_PRIORITY_CHOICES = Object.values(TicketPriority);
export const TICKET_STAGE_CHOICES = Object.values(TicketStage);

const TICKET_PRIORITY_BY_NAME: Record<string, TicketPriority> = {
  standard: TicketPriority.Standard,
  priority: TicketPriority.Priority,
  urgent: TicketPriority.Urgent,
};

const TICKET_STAGE_BY_NAME: Record<string, TicketStage> = {
  created: TicketStage.Created,
  inprogress: TicketStage.InProgress,
  escalated: TicketStage.Escalated,
  resolving: TicketStage.Resolving,
  closed: TicketStage.Closed,
};

function normalizeCliToken(value: string): string {
  return value.trim().toLowerCase().replace(/[\s_-]/g, "");
}

export function parseTicketPriority(value: string): TicketPriority {
  const normalized = normalizeCliToken(value);
  const parsed = TICKET_PRIORITY_BY_NAME[normalized];

  if (parsed) {
    return parsed;
  }

  throw new Error(`Unknown ticket priority: ${value}`);
}

export function parseTicketStage(value: string): TicketStage {
  const normalized = normalizeCliToken(value);
  const parsed = TICKET_STAGE_BY_NAME[normalized];

  if (parsed) {
    return parsed;
  }

  throw new Error(`Unknown ticket stage: ${value}`);
}
