import { Command, CommandRunner } from "nest-commander";
import Table, { type Table as TableType, } from "cli-table3";
import { CliTicketPriority, CliTicketStage } from "./common";
import { Ticket } from "src/domain/ticket/Ticket.domain";
import { TicketService } from "src/modules/ticket/Ticket.service";

@Command({ name: "list", description: "List all tickets", })
export class ListTicketCommand extends CommandRunner {
  public constructor(
    private readonly ticketService: TicketService,
  ) {
    super();
  }

  public async run(passedParams: string[], options?: Record<string, any>): Promise<void> {
    const tickets: Ticket[] = await this.ticketService.listTickets();

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
        new Date(ticket.createdAt).toLocaleString(),
        ticket.updatedAt ? new Date(ticket.updatedAt).toLocaleString() : "Not updated yet",
        CliTicketPriority[ticket.priority] || String(ticket.priority),
        CliTicketStage[ticket.stage] || String(ticket.stage),
      ]);
    }

    console.log(table.toString());
  }
}