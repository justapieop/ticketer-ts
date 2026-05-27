export const KNOWLEDGE_ID_GENERATOR = Symbol("KNOWLEDGE_ID_GENERATOR");

export interface KnowledgeIdGenerator {
  generate(): string;
}