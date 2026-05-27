import { INestApplication } from "@nestjs/common";
import { Knowledge } from "src/domain/kb/Knowledge.domain";
import { AddKnowledgeCommand } from "src/infra/commands/kb/AddKnowledge.command";
import { ListKnowledgeCommand } from "src/infra/commands/kb/ListKnowledge.command";
import { RetrieveKnowledgeCommand } from "src/infra/commands/kb/RetrieveKnowledge.command";
import { SearchKnowledgeCommand } from "src/infra/commands/kb/SearchKnowledge.command";
import { KNOWLEDGE_REPOSITORY, type KnowledgeRepository } from "src/app/kb/ports/Knowledge.repository";
import { createKbTestingApp } from "./helpers/create-kb-testing-app";

describe("KB Commands E2E", () => {
	let app: INestApplication;
	let moduleRef: any;
	let repository: KnowledgeRepository;

	beforeEach(async () => {
		const result = await createKbTestingApp();
		app = result.app;
		moduleRef = result.moduleRef;
		repository = result.repository;
	});

	afterEach(async () => {
		await app.close();
	});

	test("add creates a knowledge document and retrieve can read it back", async () => {
		const addCmd = moduleRef.get(AddKnowledgeCommand);
		const retrieveCmd = moduleRef.get(RetrieveKnowledgeCommand);

		const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

		await addCmd.run([], {
			title: "Customer Response Template",
			content: "Hello, thanks for reaching out.",
			nodePath: "/templates/email",
			tags: ["template", "email"],
		});

		const stored = await repository.retrieve("kb-e2e-id-1");
		expect(stored).toMatchObject({
			id: "kb-e2e-id-1",
			title: "Customer Response Template",
			nodePath: "/templates/email",
		});

		await retrieveCmd.run([], { id: "kb-e2e-id-1" });

		expect(logSpy).toHaveBeenCalled();
		logSpy.mockRestore();
	});

	test("list prints no documents when the repository is empty", async () => {
		const listCmd = moduleRef.get(ListKnowledgeCommand);
		const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

		await listCmd.run([], { nodePath: "/", limit: 10 });

		expect(logSpy).toHaveBeenCalledWith("No knowledge documents found.");
		logSpy.mockRestore();
	});

	test("search finds documents added through the command layer", async () => {
		const addCmd = moduleRef.get(AddKnowledgeCommand);
		const searchCmd = moduleRef.get(SearchKnowledgeCommand);
		const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

		await addCmd.run([], {
			title: "Customer Response Template",
			content: "Hello, thanks for reaching out.",
			nodePath: "/templates/email",
			tags: ["template", "email"],
		});

		await addCmd.run([], {
			title: "Engineering Runbook",
			content: "Deploy steps and rollback notes.",
			nodePath: "/docs/ops",
			tags: ["ops"],
		});

		await searchCmd.run([], { query: "Response", topK: 5 });

		const documents = await repository.search("Response", 5);
		expect(documents).toHaveLength(1);
		expect(documents[0].title).toBe("Customer Response Template");
		expect(logSpy).toHaveBeenCalled();
		logSpy.mockRestore();
	});
});