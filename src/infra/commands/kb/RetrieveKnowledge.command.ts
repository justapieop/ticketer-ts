import { Inject } from "@nestjs/common";
import { Command, CommandRunner, Option } from "nest-commander";
import Table from "cli-table3";
import { KNOWLEDGE_USE_CASES, type KnowledgeUseCase } from "src/app/kb/ports/KnowledgeUseCase.port";

export interface RetrieveKnowledgeFlags {
	id: string,
}

@Command({ name: "kb retrieve", description: "Retrieve a knowledge document by id" })
export class RetrieveKnowledgeCommand extends CommandRunner {
	public constructor(
		@Inject(KNOWLEDGE_USE_CASES) private readonly knowledgeUseCases: KnowledgeUseCase,
	) {
		super();
	}

	public async run(passedParams: string[], options: RetrieveKnowledgeFlags): Promise<void> {
		const document = await this.knowledgeUseCases.retrieve(options.id);

		const table = new Table({
			head: ["ID", "Title", "Node Path", "Tags", "Content"],
		});

		table.push([
			document.id,
			document.title,
			document.nodePath,
			document.tags.join(", "),
			document.content,
		]);

		console.log(table.toString());
	}

	@Option({
		flags: "-i, --id [string]",
		description: "Specify the document id to retrieve",
		required: true,
	})
	public parseId(val: string): string {
		return val;
	}
}