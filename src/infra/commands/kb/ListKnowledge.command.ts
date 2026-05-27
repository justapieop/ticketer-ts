import { Inject } from "@nestjs/common";
import { Command, CommandRunner, Option } from "nest-commander";
import Table from "cli-table3";
import { KNOWLEDGE_USE_CASES, type KnowledgeUseCase } from "src/app/kb/ports/KnowledgeUseCase.port";

export interface ListKnowledgeFlags {
	nodePath: string,
	limit: number,
}

@Command({ name: "kb list", description: "List knowledge documents" })
export class ListKnowledgeCommand extends CommandRunner {
	public constructor(
		@Inject(KNOWLEDGE_USE_CASES) private readonly knowledgeUseCases: KnowledgeUseCase,
	) {
		super();
	}

	public async run(passedParams: string[], options: ListKnowledgeFlags): Promise<void> {
		const documents = await this.knowledgeUseCases.list(options.nodePath, options.limit);

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
		flags: "-n, --node-path [string]",
		description: "Specify the node path to list from",
		required: false,
		defaultValue: "/",
	})
	public parseNodePath(val: string): string {
		return val;
	}

	@Option({
		flags: "-l, --limit [number]",
		description: "Limit the number of documents returned",
		required: false,
		defaultValue: 10,
	})
	public parseLimit(val: string): number {
		return Number(val);
	}
}