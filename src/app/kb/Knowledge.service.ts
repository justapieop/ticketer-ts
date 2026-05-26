import { Inject } from "@nestjs/common";
import { Knowledge } from "src/domain/kb/Knowledge.domain";
import { KNOWLEDGE_REPOSITORY, type KnowledgeRepository } from "src/domain/kb/ports/Knowledge.repository";
import { KnowledgeUseCase } from "src/domain/kb/ports/KnowledgeUseCase.port";

export class KnowledgeService implements KnowledgeUseCase {
	public constructor(
		@Inject(KNOWLEDGE_REPOSITORY) private readonly knowledgeRepository: KnowledgeRepository,
	) {}

	public async search(title: string, topK?: number): Promise<Knowledge[]> {
		return this.knowledgeRepository.search(title, topK);
	}

	public async list(nodePath?: string, limit?: number): Promise<Knowledge[]> {
		return this.knowledgeRepository.list(nodePath, limit);
	}

	public async retrieve(id: string): Promise<Knowledge> {
		return this.knowledgeRepository.retrieve(id);
	}

	public async save(knowledge: Knowledge): Promise<void> {
		await this.knowledgeRepository.save(knowledge);
	}
}