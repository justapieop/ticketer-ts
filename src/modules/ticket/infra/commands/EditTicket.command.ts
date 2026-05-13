import { Ticket } from "../../domain/Ticket.domain";
import { Command, CommandRunner, Option } from "nest-commander";
import Table from "cli-table3";
import { TicketService } from "../../Ticket.service";
import { CliTicketPriority, CliTicketStage } from "./common";

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
    let ticket: Ticket | null = await this.ticketService.getTicketById(options.id);

    if (!ticket) {
      console.error("Ticket does not exist");
      return;
    }

    if (options.title) {
      ticket.setTitle(options.title);
    }

    if (options.subject) {
      ticket.setSubject(options.subject);
    }

    if (options.priority) {
      ticket.setPriority(Ticket.parsePriority(CliTicketPriority[options.priority]));
    }

    if (options.stage) {
      ticket.setStage(Ticket.parseStage(CliTicketStage[options.stage]));
    }

    await this.ticketService.saveTicket(ticket);
    
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
        CliTicketStage[ticket.priority] || String(ticket.stage),
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
    choices: Object.keys(CliTicketPriority).filter(
      (k) => Number.isNaN(Number(k))
    ),
  })
  public parsePriority(val: string): CliTicketPriority {
    return CliTicketPriority[val as keyof typeof CliTicketPriority];
  }

  @Option({
    flags: "-o, --stage [string]",
    description: "Specify the stage for the ticket",
    required: false,
    choices: Object.keys(CliTicketStage).filter(
      (k) => Number.isNaN(Number(k))
    ),
  })
  public parseStage(val: string): CliTicketStage {
    return CliTicketStage[val as keyof typeof CliTicketStage]
  }
}
