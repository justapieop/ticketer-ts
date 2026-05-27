import { Inject } from "@nestjs/common";
import { Command, CommandRunner, Option } from "nest-commander";
import Table from "cli-table3";
import { Knowledge } from "src/domain/kb/Knowledge.domain";
import { KNOWLEDGE_ID_GENERATOR, type KnowledgeIdGenerator } from "src/app/kb/ports/KnowledgeId.generator";
import { KNOWLEDGE_USE_CASES, type KnowledgeUseCase } from "src/app/kb/ports/KnowledgeUseCase.port";

export interface AddKnowledgeFlags {
	title: string,
	content: string,
	nodePath: string,
	tags: string[],
}

@Command({ name: "kb add", description: "Add a knowledge document" })
export class AddKnowledgeCommand extends CommandRunner {
	public constructor(
		@Inject(KNOWLEDGE_USE_CASES) private readonly knowledgeUseCases: KnowledgeUseCase,
		@Inject(KNOWLEDGE_ID_GENERATOR) private readonly knowledgeIdGenerator: KnowledgeIdGenerator,
	) {
		super();
	}

	public async run(passedParams: string[], options: AddKnowledgeFlags): Promise<void> {
		const document = Knowledge.create(
			this.knowledgeIdGenerator.generate(),
			options.title,
			options.content,
			options.nodePath,
			options.tags,
		);

		await this.knowledgeUseCases.save(document);

		const table = new Table({
			head: ["ID", "Title", "Node Path", "Tags"],
		});

		table.push([
			document.id,
			document.title,
			document.nodePath,
			document.tags.join(", "),
		]);

		console.log("Knowledge document added successfully:");
		console.log(table.toString());
	}

	@Option({
		flags: "-t, --title [string]",
		description: "Specify the title for the knowledge document",
		required: true,
	})
	public parseTitle(val: string): string {
		return val;
	}

	@Option({
		flags: "-c, --content [string]",
		description: "Specify the content for the knowledge document",
		required: true,
	})
	public parseContent(val: string): string {
		return val;
	}

	@Option({
		flags: "-n, --node-path [string]",
		description: "Specify the knowledge node path",
		required: true,
	})
	public parseNodePath(val: string): string {
		return val;
	}

	@Option({
		flags: "-g, --tags [string]",
		description: "Specify comma-separated tags",
		required: false,
		defaultValue: "",
	})
	public parseTags(val: string): string[] {
		if (!val.trim()) {
			return [];
		}

		return val
			.split(",")
			.map((tag) => tag.trim())
			.filter((tag) => tag.length > 0);
	}
}