import { Command, CommandRunner, Option } from "nest-commander";
import Table from "cli-table3";
import { CliTicketPriority, CliTicketStage } from "./common";
import { Ticket } from "src/domain/ticket/Ticket.domain";
import { TicketService } from "src/app/ticket/Ticket.service";

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
    let ticket: Ticket | null = await this.ticketService.getTicketById(options.id);
  
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
      CliTicketPriority[ticket.priority] || String(ticket.priority),
      CliTicketStage[ticket.stage] || String(ticket.stage),
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