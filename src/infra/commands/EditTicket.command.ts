import { Command, CommandRunner, Option } from "nest-commander";
import Table from "cli-table3";
import {
  CLI_TICKET_PRIORITY_CHOICES,
  CLI_TICKET_STAGE_CHOICES,
  CliTicketPriority,
  CliTicketStage,
  fromDomainPriority,
  fromDomainStage,
  parseCliTicketPriority,
  parseCliTicketStage,
  toDomainPriority,
  toDomainStage,
} from "./common";
import { EditTicketInput } from "src/app/ticket/inputs/EditTicket.input";
import { Ticket } from "src/domain/ticket/Ticket.domain";
import { TicketService } from "src/app/ticket/Ticket.service";

export interface EditTicketFlags {
  id: string,
  title?: string,
  subject?: string,
  priority?: CliTicketPriority,
  stage?: CliTicketStage,
}

@Command({ name: "edit", description: "Edit ticket", })
export class EditTicketCommand extends CommandRunner {
  public constructor(
    private readonly ticketService: TicketService,
  ) {
    super();
  }
  
  public async run(passedParams: string[], options: EditTicketFlags): Promise<void> {
    const ticket: Ticket | null = await this.ticketService.editTicket(new EditTicketInput(
      options.id,
      options.title,
      options.subject,
      options.priority !== undefined ? toDomainPriority(options.priority) : undefined,
      options.stage !== undefined ? toDomainStage(options.stage) : undefined,
    ));

    if (!ticket) {
      console.error("Ticket does not exist");
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
        fromDomainPriority(ticket.priority),
        fromDomainStage(ticket.stage),
    ]);
        
    console.log(table.toString());
  }

  @Option({
    flags: "-i, --id [string]",
    description: "The id of the ticket to be edited",
    required: true,
  })
  private parseId(val: string): string {
    return val;
  }

  @Option({
    flags: "-t, --title [string]",
    description: "Set the title for the ticket",
    required: false,
  })
  private parseTitle(val: string): string {
    return val;
  }

  @Option({
    flags: "-s, --subject [string]",
    description: "Set the subject for the ticket",
    required: false,
  })
  private parseSubject(val: string): string {
    return val;
  }

  @Option({
    flags: "-p, --priority [string]",
    description: "Specify the priority for the ticket",
    required: false,
    choices: CLI_TICKET_PRIORITY_CHOICES,
  })
  public parsePriority(val: string): CliTicketPriority {
    return parseCliTicketPriority(val);
  }

  @Option({
    flags: "-o, --stage [string]",
    description: "Specify the stage for the ticket",
    required: false,
    choices: CLI_TICKET_STAGE_CHOICES,
  })
  public parseStage(val: string): CliTicketStage {
    return parseCliTicketStage(val);
  }
}
