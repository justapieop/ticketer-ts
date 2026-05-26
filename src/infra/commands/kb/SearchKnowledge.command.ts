import { Inject } from "@nestjs/common";
import { Command, CommandRunner, Option } from "nest-commander";
import Table from "cli-table3";
import { KNOWLEDGE_USE_CASES, type KnowledgeUseCase } from "src/domain/kb/ports/KnowledgeUseCase.port";

export interface SearchKnowledgeFlags {
	query: string,
	topK: number,
}

@Command({ name: "kb search", description: "Search knowledge documents" })
export class SearchKnowledgeCommand extends CommandRunner {
	public constructor(
		@Inject(KNOWLEDGE_USE_CASES) private readonly knowledgeUseCases: KnowledgeUseCase,
	) {
		super();
	}

	public async run(passedParams: string[], options: SearchKnowledgeFlags): Promise<void> {
		const documents = await this.knowledgeUseCases.search(options.query, options.topK);

		if (documents.length === 0) {
			console.log("No knowledge documents found.");
			return;
		}

		const table = new Table({
			head: ["ID", "Title", "Node Path", "Tags"],
		});

		for (const document of documents) {
			table.push([
				document.id,
				document.title,
				document.nodePath,
				document.tags.join(", "),
			]);
		}

		console.log(table.toString());
	}

	@Option({
		flags: "-q, --query [string]",
		description: "Specify the search query",
		required: true,
	})
	public parseQuery(val: string): string {
		return val;
	}

	@Option({
		flags: "-k, --top-k [number]",
		description: "Limit the number of search results",
		required: false,
		defaultValue: 5,
	})
	public parseTopK(val: string): number {
		return Number(val);
	}
}