import { Command, CommandRunner } from "nest-commander";
import { TicketService } from "../Ticket.service";
import { Ticket, TicketPriority, TicketStage } from "../domain/Ticket.schema";
import Table from "cli-table3";

@Command({ name: "list", description: "List all tickets", })
export class ListTicketCommand extends CommandRunner {
  public constructor(
    private readonly ticketService: TicketService,
  ) {
    super();
  }

  public async run(passedParams: string[], options?: Record<string, any>): Promise<void> {
    const tickets: Ticket[] = await this.ticketService.listTicket();

    if (tickets.length === 0) {
      console.log("No tickets found.");
      return;
    }

    const table = new Table({
      head: ["ID", "Title", "Subject", "Created", "Last Updated", "Priority", "Stage"],
    });

    for (const ticket of tickets) {
      table.push([
        ticket.id,
        ticket.title,
        ticket.subject,
        new Date(ticket.createdAt).toLocaleString(),
        ticket.updatedAt ? new Date(ticket.updatedAt).toLocaleString() : "Not updated yet",
        TicketPriority[ticket.priority] || String(ticket.priority),
        TicketStage[ticket.stage] || String(ticket.stage),
      ]);
    }

    console.log(table.toString());
  }
}