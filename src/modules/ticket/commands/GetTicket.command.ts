import { Command, CommandRunner, Option } from "nest-commander";
import { Ticket, TicketPriority, TicketStage } from "../domain/Ticket.domain";
import Table from "cli-table3";
import { GetTicketUseCase } from "../application/cases/GetTicket.case";
import { TicketNotFoundError } from "../domain/exceptions/TicketNotFound.error";

export interface GetTicketFlags {
  id: string,
}

@Command({ name: "get", description: "Get a ticket by id", })
export class GetTicketCommand extends CommandRunner {
  public constructor(
    private readonly getTicketUseCase: GetTicketUseCase,
  ) {
    super();
  }

  public async run(passedParams: string[], options: GetTicketFlags): Promise<void> {
    let ticket: Ticket;
    try {
      ticket = await this.getTicketUseCase.execute(options.id);
    } catch (error) {
      if (error instanceof TicketNotFoundError) {
        console.log(`No ticket found with id: ${options.id}`);
        return;
      }
      throw error;
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
    description: "Specify the id of the ticket to get",
    required: true,
  })
  private parseId(val: string): string {
    return val;
  }
}