import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { KnowledgeService } from "src/app/kb/Knowledge.service";
import { KNOWLEDGE_ID_GENERATOR } from "src/app/kb/ports/KnowledgeId.generator";
import { KNOWLEDGE_REPOSITORY, type KnowledgeRepository } from "src/app/kb/ports/Knowledge.repository";
import { KNOWLEDGE_USE_CASES } from "src/app/kb/ports/KnowledgeUseCase.port";
import { MockKnowledgeRepository } from "src/infra/mock/MockKnowledge.repository";
import { AddKnowledgeCommand } from "src/infra/commands/kb/AddKnowledge.command";
import { ListKnowledgeCommand } from "src/infra/commands/kb/ListKnowledge.command";
import { RetrieveKnowledgeCommand } from "src/infra/commands/kb/RetrieveKnowledge.command";
import { SearchKnowledgeCommand } from "src/infra/commands/kb/SearchKnowledge.command";

export async function createKbTestingApp(): Promise<{
	app: INestApplication;
	moduleRef: TestingModule;
	repository: KnowledgeRepository;
}> {
	const repository = new MockKnowledgeRepository();
	let nextKnowledgeId = 1;

	const moduleRef: TestingModule = await Test.createTestingModule({
		providers: [
			{
				provide: KNOWLEDGE_ID_GENERATOR,
				useValue: { generate: () => `kb-e2e-id-${nextKnowledgeId++}` },
			},
			{
				provide: KNOWLEDGE_REPOSITORY,
				useValue: repository,
			},
			{
				provide: KNOWLEDGE_USE_CASES,
				useFactory: (knowledgeRepository: KnowledgeRepository): KnowledgeService =>
					new KnowledgeService(knowledgeRepository),
				inject: [KNOWLEDGE_REPOSITORY],
			},
			AddKnowledgeCommand,
			ListKnowledgeCommand,
			RetrieveKnowledgeCommand,
			SearchKnowledgeCommand,
		],
	})
		.compile();

	const app = moduleRef.createNestApplication();
	await app.init();

	return { app, moduleRef, repository };
}