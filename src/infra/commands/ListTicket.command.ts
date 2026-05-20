import { Inject } from "@nestjs/common";
import { Command, CommandRunner } from "nest-commander";
import Table, { type Table as TableType, } from "cli-table3";

import { TICKET_USE_CASES, type TicketUseCases } from "src/domain/ticket/ports/TicketUseCases.port";

@Command({ name: "list", description: "List all tickets", })
export class ListTicketCommand extends CommandRunner {
  public constructor(
    @Inject(TICKET_USE_CASES) private readonly ticketUseCases: TicketUseCases,
  ) {
    super();
  }

  public async run(passedParams: string[], options?: Record<string, any>): Promise<void> {
    const tickets = await this.ticketUseCases.listTickets();

    if (tickets.length === 0) {
      console.log("No tickets found.");
      return;
    }

    const table: TableType = new Table({
      head: ["ID", "Title", "Subject", "Created", "Last Updated", "Priority", "Stage"],
    });

    for (const ticket of tickets) {
      table.push([
        ticket.id,
        ticket.title,
        ticket.subject,
        ticket.createdAt.toLocaleString(),
        ticket.updatedAt ? ticket.updatedAt.toLocaleString() : "Not updated yet",
        ticket.priority,
        ticket.stage,
      ]);
    }

    console.log(table.toString());
  }
}
