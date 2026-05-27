import { Module } from "@nestjs/common";
import { KnowledgeService } from "src/app/kb/Knowledge.service";
import { KNOWLEDGE_ID_GENERATOR } from "src/app/kb/ports/KnowledgeId.generator";
import { KNOWLEDGE_REPOSITORY, type KnowledgeRepository } from "src/app/kb/ports/Knowledge.repository";
import { KNOWLEDGE_USE_CASES } from "src/app/kb/ports/KnowledgeUseCase.port";
import { AddKnowledgeCommand } from "src/infra/commands/kb/AddKnowledge.command";
import { ListKnowledgeCommand } from "src/infra/commands/kb/ListKnowledge.command";
import { RetrieveKnowledgeCommand } from "src/infra/commands/kb/RetrieveKnowledge.command";
import { SearchKnowledgeCommand } from "src/infra/commands/kb/SearchKnowledge.command";
import { NanoIdGenerator } from "src/infra/nanoid/NanoId.generator";
import { HttpKnowledgeRepository } from "src/infra/http/HttpKnowledge.repository";
import { MockKnowledgeRepository } from "src/infra/mock/MockKnowledge.repository";

@Module({
	providers: [
		NanoIdGenerator,
		{
			provide: KNOWLEDGE_ID_GENERATOR,
			useExisting: NanoIdGenerator,
		},
		{
			provide: KNOWLEDGE_REPOSITORY,
			useFactory: (): MockKnowledgeRepository | HttpKnowledgeRepository => {
				const kbApiBaseUrl = process.env.KB_API_BASE_URL;

				if (kbApiBaseUrl) {
					return new HttpKnowledgeRepository({
						baseUrl: kbApiBaseUrl,
						defaultNodePath: process.env.KB_API_DEFAULT_NODE_PATH,
						searchTopK: process.env.KB_API_SEARCH_TOP_K ? Number(process.env.KB_API_SEARCH_TOP_K) : undefined,
						listLimit: process.env.KB_API_LIST_LIMIT ? Number(process.env.KB_API_LIST_LIMIT) : undefined,
					});
				}

				return new MockKnowledgeRepository();
			},
		},
		{
			provide: KNOWLEDGE_USE_CASES,
			useFactory: (knowledgeRepository: KnowledgeRepository): KnowledgeService =>
				new KnowledgeService(knowledgeRepository),
			inject: [KNOWLEDGE_REPOSITORY],
		},
		SearchKnowledgeCommand,
		ListKnowledgeCommand,
		RetrieveKnowledgeCommand,
		AddKnowledgeCommand,
	],
	exports: [KNOWLEDGE_USE_CASES, KNOWLEDGE_REPOSITORY],
})
export class KnowledgeModule {}