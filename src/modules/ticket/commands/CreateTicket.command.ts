import { Command, CommandRunner, Option } from "nest-commander";
import { Ticket, TicketPriority, TicketStage } from "../domain/Ticket.domain";
import Table from "cli-table3";
import { CreateTicketUseCase } from "../application/cases/CreateTicket.case";
import { CreateTicketDto } from "../application/dtos/CreateTicket.dto";

export interface CreateTicketFlags {
  title: string,
  subject: string,
  priority: TicketPriority,
  stage: TicketStage,
}

@Command({ name: "create" })
export class CreateTicketCommand extends CommandRunner {
  public constructor(
    private readonly createTicketUseCase: CreateTicketUseCase,
  ) {
    super();
  }

  public async run(passedParams: string[], options: CreateTicketFlags): Promise<void> {
    const ticket: Ticket = await this.createTicketUseCase.execute(new CreateTicketDto(
      options.title,
      options.subject,
      options.priority,
      options.stage,
    ));

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
    defaultValue: TicketPriority.Standard,
    choices: Object.keys(TicketPriority).filter(
      (key) => Number.isNaN(Number(key))
    ),
  })
  public parsePriority(val: string): TicketPriority {
    return TicketPriority[val as keyof typeof TicketPriority];
  }

  @Option({
    flags: "-o, --stage [string]",
    description: "Specify the stage for the ticket",
    required: false,
    defaultValue: TicketStage.Created,
    choices: Object.keys(TicketStage).filter(
      (key) => Number.isNaN(Number(key))
    ),
  })
  public parseStage(val: string): TicketStage {
    return TicketStage[val as keyof typeof TicketStage];
  }
}