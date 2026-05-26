export class MockKnowledgeSchema {
  public constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly content: string,
    public readonly nodePath: string,
    public readonly tags: string[],
  ) {}
}