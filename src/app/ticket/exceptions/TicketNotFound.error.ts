export class TicketNotFoundError extends Error {
  public constructor(id: string) {
    super(`Ticket with id ${id} not found`);
    this.name = "TicketNotFoundError";
  }
}
