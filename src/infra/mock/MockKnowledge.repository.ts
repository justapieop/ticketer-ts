import { Knowledge } from "src/domain/kb/Knowledge.domain";
import { KnowledgeRepository } from "src/app/kb/ports/Knowledge.repository";
import { MockKnowledgeSchema } from "./MockKnowledge.schema";

export class MockKnowledgeRepository implements KnowledgeRepository {
  private readonly store: Map<string, MockKnowledgeSchema>;

  public constructor() {
    this.store = new Map();
  }

  public async save(knowledge: Knowledge): Promise<void> {
    this.store.set(knowledge.id, new MockKnowledgeSchema(
      knowledge.id,
      knowledge.title,
      knowledge.content,
      knowledge.nodePath,
      knowledge.tags,
    ));
  }

  public async search(title: string, topK?: number): Promise<Knowledge[]> {
    return [...this.store.values()]
      .filter((f) => f.title.includes(title))
      .slice(0, topK ?? Number.MAX_SAFE_INTEGER)
      .map((f) => this.toDomain(f));
  }

  public async list(nodePath?: string, limit?: number): Promise<Knowledge[]> {
    return [...this.store.values()]
      .filter((f) => nodePath === undefined || f.nodePath === nodePath)
      .slice(0, limit ?? Number.MAX_SAFE_INTEGER)
      .map((f) => this.toDomain(f));
  }

  public async retrieve(id: string): Promise<Knowledge> {
    const kb: MockKnowledgeSchema | undefined = this.store.get(id);

    if (!kb) {
      throw new Error(`Knowledge with id ${id} not found`);
    }

    return this.toDomain(kb);
  }

  private toDomain(schema: MockKnowledgeSchema): Knowledge {
    return Knowledge.reconstitute(
      schema.id,
      schema.title,
      schema.content,
      schema.nodePath,
      schema.tags,
    );
  }
}