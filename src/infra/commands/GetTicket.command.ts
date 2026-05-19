import { Inject } from "@nestjs/common";
import { Command, CommandRunner, Option } from "nest-commander";
import Table from "cli-table3";

import { TicketNotFoundError } from "src/domain/ticket/exceptions/TicketNotFound.error";
import { TICKET_USE_CASES, type TicketUseCases } from "src/app/ticket/ports/TicketUseCases.port";

export interface GetTicketFlags {
  id: string,
}

@Command({ name: "get", description: "Get a ticket by id", })
export class GetTicketCommand extends CommandRunner {
  public constructor(
    @Inject(TICKET_USE_CASES) private readonly ticketUseCases: TicketUseCases,
  ) {
    super();
  }

  public async run(passedParams: string[], options: GetTicketFlags): Promise<void> {
    try {
      const ticket = await this.ticketUseCases.getTicketById(options.id);

      const table = new Table({
        head: ["ID", "Title", "Subject", "Created", "Last Updated", "Priority", "Stage"],
      });
      
      table.push([
        ticket.id,
        ticket.title,
        ticket.subject,
        ticket.createdAt.toLocaleString(),
        ticket.updatedAt ? ticket.updatedAt.toLocaleString() : "Not updated yet",
        ticket.priority,
        ticket.stage,
      ]);
      
      console.log(table.toString());
    } catch (error) {
      if (error instanceof TicketNotFoundError) {
        console.error(`Error: ${error.message}`);
        return;
      }
      throw error;
    }
  }

  @Option({
    flags: "-i, --id [string]",
    description: "Specify the id of the ticket to get",
    required: true,
  })
  public parseId(val: string): string {
    return val;
  }
}
