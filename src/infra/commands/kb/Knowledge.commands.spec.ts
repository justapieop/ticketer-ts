import { Knowledge } from "src/domain/kb/Knowledge.domain";
import { AddKnowledgeCommand } from "./AddKnowledge.command";
import { ListKnowledgeCommand } from "./ListKnowledge.command";
import { RetrieveKnowledgeCommand } from "./RetrieveKnowledge.command";
import { SearchKnowledgeCommand } from "./SearchKnowledge.command";

describe("Knowledge commands", () => {
	test("search command delegates to the use-case and prints results", async () => {
		const knowledge = Knowledge.reconstitute("doc-1", "Template", "content", "/templates/email", ["template"]);
		const knowledgeUseCases = {
			search: jest.fn().mockResolvedValue([knowledge]),
		} as any;
		const command = new SearchKnowledgeCommand(knowledgeUseCases);
		const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

		await command.run([], { query: "template", topK: 3 });

		expect(knowledgeUseCases.search).toHaveBeenCalledWith("template", 3);
		expect(logSpy).toHaveBeenCalled();
		logSpy.mockRestore();
	});

	test("list command delegates with node path and limit", async () => {
		const knowledge = Knowledge.reconstitute("doc-2", "Guide", "content", "/docs/guides", []);
		const knowledgeUseCases = {
			list: jest.fn().mockResolvedValue([knowledge]),
		} as any;
		const command = new ListKnowledgeCommand(knowledgeUseCases);
		const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

		await command.run([], { nodePath: "/docs/guides", limit: 2 });

		expect(knowledgeUseCases.list).toHaveBeenCalledWith("/docs/guides", 2);
		expect(logSpy).toHaveBeenCalled();
		logSpy.mockRestore();
	});

	test("retrieve command delegates and prints the document", async () => {
		const knowledge = Knowledge.reconstitute("doc-3", "Doc 3", "body", "/docs", ["guide"]);
		const knowledgeUseCases = {
			retrieve: jest.fn().mockResolvedValue(knowledge),
		} as any;
		const command = new RetrieveKnowledgeCommand(knowledgeUseCases);
		const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

		await command.run([], { id: "doc-3" });

		expect(knowledgeUseCases.retrieve).toHaveBeenCalledWith("doc-3");
		expect(logSpy).toHaveBeenCalled();
		logSpy.mockRestore();
	});

	test("add command generates an id and saves a created document", async () => {
		const knowledgeUseCases = {
			save: jest.fn().mockResolvedValue(undefined),
		} as any;
		const knowledgeIdGenerator = {
			generate: jest.fn().mockReturnValue("kb-1"),
		} as any;
		const command = new AddKnowledgeCommand(knowledgeUseCases, knowledgeIdGenerator);
		const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

		await command.run([], {
			title: "Customer Response Template",
			content: "Hello, thanks for reaching out.",
			nodePath: "/templates/email",
			tags: ["template", "email"],
		});

		expect(knowledgeIdGenerator.generate).toHaveBeenCalled();
		expect(knowledgeUseCases.save).toHaveBeenCalledWith(expect.objectContaining({
			id: "kb-1",
			title: "Customer Response Template",
			content: "Hello, thanks for reaching out.",
			nodePath: "/templates/email",
			tags: ["template", "email"],
		}));
		expect(logSpy).toHaveBeenCalled();
		logSpy.mockRestore();
	});
});