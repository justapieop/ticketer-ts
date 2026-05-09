import { Ticket, TicketPriority, TicketStage } from "../domain/Ticket.domain";
import { Command, CommandRunner, Option } from "nest-commander";
import { TicketService } from "../Ticket.service";
import Table from "cli-table3";

export interface EditTicketFlags {
  id: string,
  title?: string,
  subject?: string,
  priority?: TicketPriority,
  stage?: TicketStage,
}

@Command({ name: "ticket", description: "Edit ticket", })
export class EditTicketCommand extends CommandRunner {
  public constructor(
    private readonly ticketService: TicketService,
  ) {
    super();
  }
  
  public async run(passedParams: string[], options: EditTicketFlags): Promise<void> {
    const ticket: Ticket | null = await this.ticketService.getTicketById(options.id);

    if (!ticket) {
      console.error("Ticket does not exist");
      return;
    }

    if (options.title) {
      await this.ticketService.setTicketTitle(options.id, options.title)
    }

    if (options.subject) {
      await this.ticketService.setTicketSubject(options.id, options.subject);
    }

    if (options.priority) {
      await this.ticketService.setTicketPriority(options.id, options.priority);
    }

    if (options.stage) {
      await this.ticketService.setTicketStage(options.id, options.stage);
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
