import { Knowledge } from "../Knowledge.domain";

export const KNOWLEDGE_REPOSITORY = Symbol("KNOWLEDGE_REPOSITORY");

export interface KnowledgeRepository {
  search(title: string, topK?: number): Promise<Knowledge[]>;
  list(nodePath?: string, limit?: number): Promise<Knowledge[]>;
  retrieve(id: string): Promise<Knowledge>;
  save(knowledge: Knowledge): Promise<void>;
}