export const TICKET_ID_GENERATOR = Symbol("TICKET_ID_GENERATOR");

export interface TicketIdGenerator {
  generate(): string;
}