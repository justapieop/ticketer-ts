import { Command, CommandRunner, Option } from "nest-commander";
import { TicketStage } from "../domain/Ticket.schema";
import { TicketService } from "../Ticket.service";

export interface SetTicketStageFlags {
  id: string;
  stage: TicketStage;
}

@Command({ name: "set-stage", description: "Set the stage of a ticket" })
export class SetTicketStageCommand extends CommandRunner {
  public constructor(
    private readonly ticketService: TicketService,
  ) {
    super();
  }

  public async run(passedParams: string[], options: SetTicketStageFlags): Promise<void> {
    try {
      await this.ticketService.setTicketStage(options.id, options.stage);
      console.log(`Ticket ${options.id} stage updated successfully to ${TicketStage[options.stage] || options.stage}.`);
    } catch (e: any) {
      console.error(`Failed to update ticket stage: ${e.message}`);
    }
  }

  @Option({
    flags: "-i, --id <string>",
    description: "Specify the ID of the ticket",
    required: true,
  })
  public parseId(val: string): string {
    return val;
  }

  @Option({
    flags: "-o, --stage <string>",
    description: "Specify the new stage for the ticket",
    required: true,
    choices: Object.keys(TicketStage).filter(
      (key) => Number.isNaN(Number(key))
    ),
  })
  public parseStage(val: string): TicketStage {
    return TicketStage[val as keyof typeof TicketStage];
  }
}
