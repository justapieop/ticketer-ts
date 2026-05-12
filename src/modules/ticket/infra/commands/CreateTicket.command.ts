import { Command, CommandRunner, Option } from "nest-commander";
import { Ticket, TicketPriority, TicketStage } from "../../domain/Ticket.domain";
import Table from "cli-table3";
import { TicketService } from "../../Ticket.service";

export interface CreateTicketFlags {
  title: string,
  subject: string,
  priority: string,
}

@Command({ name: "create" })
export class CreateTicketCommand extends CommandRunner {
  public constructor(
    private readonly ticketService: TicketService,
  ) {
    super();
  }

  public async run(passedParams: string[], options: CreateTicketFlags): Promise<void> {
    const ticket: Ticket = await this.ticketService.createTicket(
      options.title,
      options.subject,
      Ticket.parsePriority(options.priority),
    );

    const table = new Table({
      head: ["ID", "Title", "Subject", "Created", "Priority", "Stage"],
    });

    table.push([
      ticket.id,
      ticket.title,
      ticket.subject,
      new Date(ticket.createdAt).toLocaleString(),
      TicketPriority[ticket.priority] || String(ticket.priority),
      TicketStage[ticket.stage] || String(ticket.stage),
    ]);

    console.log("Ticket created successfully:");
    console.log(table.toString());
  }

  @Option({
    flags: "-t, --title [string]",
    description: "Specify the title for the ticket",
    required: true,
  })
  public parseTitle(val: string): string {
    return val;
  }

  @Option({
    flags: "-s, --subject [string]",
    description: "Specify the subject for the ticket",
    required: true,
  })
  public parseSubject(val: string): string {
    return val;
  }

  @Option({
    flags: "-p, --priority [string]",
    description: "Specify the priority for the ticket",
    required: false,
    defaultValue: "Standard",
    choices: [
      "Standard",
      "Priority",
      "Urgent",
    ],
  })
  public parsePriority(val: string): string {
    return val
  }
}