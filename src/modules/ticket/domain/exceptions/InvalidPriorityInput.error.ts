export class InvalidPriorityInput extends Error {
  public constructor(input: string) {
    super(`Cannot parse priority name for input: ${input}`);
  }
}