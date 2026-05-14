import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TypeOrmTicketPriority, TypeOrmTicketSchema, TypeOrmTicketStage } from "./TypeOrmTicket.schema";
import { TicketRepository } from "src/app/ticket/Ticket.repository";
import { Ticket, TicketPriority, TicketStage } from "src/domain/ticket/Ticket.domain";

@Injectable()
export class TypeOrmTicketRepository implements TicketRepository {
  public constructor(
    @InjectRepository(TypeOrmTicketSchema)
    private readonly ticketRepository: Repository<TypeOrmTicketSchema>,
  ) { }

  public async save(ticket: Ticket): Promise<Ticket> {
    const schema: TypeOrmTicketSchema = this.ticketRepository.create({
      id: ticket.id,
      title: ticket.title,
      subject: ticket.subject,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
      priority: this.toSchemaPriority(ticket.priority),
      stage: this.toSchemaStage(ticket.stage),
    });

    await this.ticketRepository.createQueryBuilder()
      .insert()
      .values(schema)
      .orUpdate(["title", "subject", "priority", "stage"], ["id"])
      .execute();
    return ticket;
  }

  public async getTicketById(id: string): Promise<Ticket | null> {
    const schema: TypeOrmTicketSchema | null = await this.ticketRepository.findOneBy({ id });

    if (!schema) {
      return null;
    }

    const newTicket: Ticket = new Ticket(
      schema.id,
      schema.title,
      schema.subject,
      schema.createdAt,
      schema.updatedAt,
      Ticket.parsePriority(TypeOrmTicketPriority[schema.priority]),
      Ticket.parseStage(TypeOrmTicketStage[schema.stage]),
    );

    return newTicket;
  }

  public async listTicket(): Promise<Ticket[]> {
    const data: TypeOrmTicketSchema[] = await this.ticketRepository.find();

    return data.map((d) => new Ticket(
      d.id,
      d.title,
      d.subject,
      d.createdAt,
      d.updatedAt,
      Ticket.parsePriority(TypeOrmTicketPriority[d.priority]),
      Ticket.parseStage(TypeOrmTicketStage[d.stage]),
    ));
  }

  private toSchemaPriority(priority: TicketPriority): TypeOrmTicketPriority {
    return priority as unknown as TypeOrmTicketPriority;
  }

  private toSchemaStage(stage: TicketStage): TypeOrmTicketStage {
    return stage as unknown as TypeOrmTicketStage;
  }
}
