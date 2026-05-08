import { Command, CommandRunner, Option } from "nest-commander";
import { TicketService } from "../Ticket.service";
import { Ticket, TicketPriority, TicketStage } from "../domain/Ticket.schema";
import Table from "cli-table3";

export interface GetTicketFlags {
  id: string,
}

@Command({ name: "get", description: "Get a ticket by id", })
export class GetTicketCommand extends CommandRunner {
  public constructor(
    private readonly ticketService: TicketService,
  ) {
    super();
  }

  public async run(passedParams: string[], options: GetTicketFlags): Promise<void> {
    const ticket: Ticket | null = await this.ticketService.getTicketById(options.id);

    if (!ticket) {
      console.log(`No ticket found with id: ${options.id}`);
      return;
    }

    const table = new Table({
      head: ["ID", "Title", "Subject", "Created", "Last Updated", "Priority", "Stage"],
    });
    
    table.push([
      ticket.id,
      ticket.title,
      ticket.subject,
      new Date(ticket.createdAt).toLocaleString(),
      ticket.updatedAt ? new Date(ticket.updatedAt).toLocaleString() : "Not updated yet",
      TicketPriority[ticket.priority] || String(ticket.priority),
      TicketStage[ticket.stage] || String(ticket.stage),
    ]);
    
    console.log(table.toString());
  }

  @Option({
    flags: "-i, --id [string]",
    description: "Specify the id of the ticket to get",
    required: true,
  })
  private parseId(val: string): string {
    return val;
  }
}