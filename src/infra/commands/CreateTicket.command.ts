import { Command, CommandRunner, Option } from "nest-commander";
import Table from "cli-table3";
import {
  CLI_TICKET_PRIORITY_CHOICES,
  CliTicketPriority,
  fromDomainPriority,
  fromDomainStage,
  parseCliTicketPriority,
  toDomainPriority,
} from "./common";
import { CreateTicketInput } from "src/app/ticket/inputs/CreateTicket.input";
import { Ticket } from "src/domain/ticket/Ticket.domain";
import { TicketService } from "src/app/ticket/Ticket.service";

export interface CreateTicketFlags {
  title: string,
  subject: string,
  priority: CliTicketPriority,
}

@Command({ name: "create" })
export class CreateTicketCommand extends CommandRunner {
  public constructor(
    private readonly ticketService: TicketService,
  ) {
    super();
  }

  public async run(passedParams: string[], options: CreateTicketFlags): Promise<void> {
    const ticket: Ticket = await this.ticketService.createTicket(new CreateTicketInput(
      options.title,
      options.subject,
      options.priority !== undefined ? toDomainPriority(options.priority) : undefined,
    ));

    const table = new Table({
      head: ["ID", "Title", "Subject", "Created", "Priority", "Stage"],
    });

    table.push([
      ticket.id,
      ticket.title,
      ticket.subject,
      new Date(ticket.createdAt).toLocaleString(),
      fromDomainPriority(ticket.priority),
      fromDomainStage(ticket.stage),
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
    defaultValue: CliTicketPriority.Standard,
    choices: CLI_TICKET_PRIORITY_CHOICES,
  })
  public parsePriority(val: string): CliTicketPriority {
    return parseCliTicketPriority(val);
  }
}
