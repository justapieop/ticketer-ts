import { Ticket, TicketPriority, TicketStage } from "../domain/Ticket.domain";
import { Command, CommandRunner, Option } from "nest-commander";
import Table from "cli-table3";
import { GetTicketUseCase } from "../application/cases/GetTicket.case";
import { UpdateTicketUseCase } from "../application/cases/UpdateTicket.case";
import { UpdateTicketDto } from "../application/dtos/UpdateTicket.dto";
import { TicketNotFoundError } from "../domain/exceptions/TicketNotFound.error";

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
    private readonly getTicketUseCase: GetTicketUseCase,
    private readonly updateTicketUseCase: UpdateTicketUseCase,
  ) {
    super();
  }
  
  public async run(passedParams: string[], options: EditTicketFlags): Promise<void> {
    let ticket: Ticket;
    try {
      ticket = await this.getTicketUseCase.execute(options.id);
    } catch (error) {
      if (error instanceof TicketNotFoundError) {
        console.error("Ticket does not exist");
        return;
      }
      throw error;
    }

    await this.updateTicketUseCase.execute(
      new UpdateTicketDto(
        options.id,
        options.title,
        options.subject,
        options.priority,
        options.stage,
      ),
    );

    const updatedTicket = await this.getTicketUseCase.execute(options.id);
    const table = new Table({
      head: ["ID", "Title", "Subject", "Created", "Last Updated", "Priority", "Stage"],
    });
        
    table.push([
        updatedTicket.id,
        updatedTicket.title,
        updatedTicket.subject,
        new Date(updatedTicket.createdAt).toLocaleString(),
        updatedTicket.updatedAt ? new Date(updatedTicket.updatedAt).toLocaleString() : "Not updated yet",
        TicketPriority[updatedTicket.priority] || String(updatedTicket.priority),
        TicketStage[updatedTicket.stage] || String(updatedTicket.stage),
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
