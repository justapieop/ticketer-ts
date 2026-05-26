import { Inject } from "@nestjs/common";
import { Command, CommandRunner, Option } from "nest-commander";
import Table from "cli-table3";
import {
  TICKET_PRIORITY_CHOICES,
  TICKET_STAGE_CHOICES,
  parseTicketPriority,
  parseTicketStage,
} from "../common";
import { EditTicketInput } from "src/app/ticket/inputs/EditTicket.input";
import { TicketPriority, TicketStage } from "src/domain/ticket/Ticket.domain";
import { TicketNotFoundError } from "src/app/ticket/exceptions/TicketNotFound.error";
import { InvalidTicketDataError } from "src/domain/ticket/exceptions/InvalidTicketData.error";
import { TICKET_USE_CASES, type TicketUseCases } from "src/domain/ticket/ports/TicketUseCases.port";

export interface EditTicketFlags {
  id: string,
  title?: string,
  subject?: string,
  priority?: TicketPriority,
  stage?: TicketStage,
}

@Command({ name: "edit", description: "Edit ticket", })
export class EditTicketCommand extends CommandRunner {
  public constructor(
    @Inject(TICKET_USE_CASES) private readonly ticketUseCases: TicketUseCases,
  ) {
    super();
  }
  
  public async run(passedParams: string[], options: EditTicketFlags): Promise<void> {
    try {
      const ticket = await this.ticketUseCases.editTicket(new EditTicketInput(
        options.id,
        options.title,
        options.subject,
        options.priority,
        options.stage,
      ));
      
      const table = new Table({
        head: ["ID", "Title", "Subject", "Created", "Last Updated", "Priority", "Stage"],
      });
          
      table.push([
          ticket.id,
          ticket.title,
          ticket.subject,
          ticket.createdAt.toLocaleString(),
          ticket.updatedAt ? ticket.updatedAt.toLocaleString() : "Not updated yet",
          ticket.priority,
          ticket.stage,
      ]);
          
      console.log(table.toString());
    } catch (error) {
      if (error instanceof TicketNotFoundError || error instanceof InvalidTicketDataError) {
        console.error(`Error: ${error.message}`);
        return;
      }
      throw error;
    }
  }

  @Option({
    flags: "-i, --id [string]",
    description: "The id of the ticket to be edited",
    required: true,
  })
  public parseId(val: string): string {
    return val;
  }

  @Option({
    flags: "-t, --title [string]",
    description: "Set the title for the ticket",
    required: false,
  })
  public parseTitle(val: string): string {
    return val;
  }

  @Option({
    flags: "-s, --subject [string]",
    description: "Set the subject for the ticket",
    required: false,
  })
  public parseSubject(val: string): string {
    return val;
  }

  @Option({
    flags: "-p, --priority [string]",
    description: "Specify the priority for the ticket",
    required: false,
    choices: TICKET_PRIORITY_CHOICES,
  })
  public parsePriority(val: string): TicketPriority {
    return parseTicketPriority(val);
  }

  @Option({
    flags: "-o, --stage [string]",
    description: "Specify the stage for the ticket",
    required: false,
    choices: TICKET_STAGE_CHOICES,
  })
  public parseStage(val: string): TicketStage {
    return parseTicketStage(val);
  }
}