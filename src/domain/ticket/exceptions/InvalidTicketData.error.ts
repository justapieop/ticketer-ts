export class InvalidTicketDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidTicketDataError';
  }
}