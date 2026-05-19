export class InvalidTicketDataError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "InvalidTicketDataError";
  }
}