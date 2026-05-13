export class InvalidStageInput extends Error {
  public constructor(input: string) {
    super(`Cannot parse stage name for input: ${input}`);
  }
}