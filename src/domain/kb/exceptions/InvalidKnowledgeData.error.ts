export class InvalidKnowledgeDataError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "InvalidKnowledgeDataError";
  }
}
