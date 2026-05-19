import { Inject } from "@nestjs/common";
import { Command, CommandRunner, Option } from "nest-commander";
import Table from "cli-table3";
import {
  TICKET_PRIORITY_CHOICES,
  parseTicketPriority,
} from "./common";
import { CreateTicketInput } from "src/app/ticket/inputs/CreateTicket.input";
import { TicketPriority } from "src/domain/ticket/Ticket.domain";
import { TICKET_USE_CASES, type TicketUseCases } from "src/app/ticket/ports/TicketUseCases.port";

export interface CreateTicketFlags {
  title: string,
  subject: string,
  priority: TicketPriority,
}

@Command({ name: "create", description: "Create a new ticket" })
export class CreateTicketCommand extends CommandRunner {
  public constructor(
    @Inject(TICKET_USE_CASES) private readonly ticketUseCases: TicketUseCases,
  ) {
    super();
  }

  public async run(passedParams: string[], options: CreateTicketFlags): Promise<void> {
    const ticket = await this.ticketUseCases.createTicket(new CreateTicketInput(
      options.title,
      options.subject,
      options.priority,
    ));

    const table = new Table({
      head: ["ID", "Title", "Subject", "Created", "Priority", "Stage"],
    });

    table.push([
      ticket.id,
      ticket.title,
      ticket.subject,
      ticket.createdAt.toLocaleString(),
      ticket.priority,
      ticket.stage,
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
    defaultValue: TicketPriority.Standard,
    choices: TICKET_PRIORITY_CHOICES,
  })
  public parsePriority(val: string): TicketPriority {
    return parseTicketPriority(val);
  }
}
