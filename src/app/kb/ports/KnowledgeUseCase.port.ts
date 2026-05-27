import { Knowledge } from "../../../domain/kb/Knowledge.domain";

export const KNOWLEDGE_USE_CASES = Symbol("KNOWLEDGE_USE_CASES");

export interface KnowledgeUseCase {
	search(title: string, topK?: number): Promise<Knowledge[]>;
	list(nodePath?: string, limit?: number): Promise<Knowledge[]>;
	retrieve(id: string): Promise<Knowledge>;
	save(knowledge: Knowledge): Promise<void>;
}