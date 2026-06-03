import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TypeOrmTicketPriority, TypeOrmTicketSchema, TypeOrmTicketStage } from "./TypeOrmTicket.schema";
import { Ticket, TicketPriority, TicketStage } from "src/domain/ticket";
import { TicketRepository } from "src/app/ticket/ports/TicketRepository.port";

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
      .orUpdate(["title", "subject", "priority", "stage", "updatedAt"], ["id"])
      .execute();
    return ticket;
  }

  public async getTicketById(id: string): Promise<Ticket | null> {
    const schema: TypeOrmTicketSchema | null = await this.ticketRepository.findOneBy({ id });

    if (!schema) {
      return null;
    }

    const newTicket: Ticket = Ticket.reconstitute(schema.id, {
      title: schema.title,
      subject: schema.subject,
      createdAt: new Date(schema.createdAt),
      updatedAt: schema.updatedAt ? new Date(schema.updatedAt) : null,
      priority: this.toDomainPriority(schema.priority),
      stage: this.toDomainStage(schema.stage),
    });

    return newTicket;
  }

  public async listTicket(): Promise<Ticket[]> {
    const data: TypeOrmTicketSchema[] = await this.ticketRepository.find();

    return data.map((d) => Ticket.reconstitute(d.id, {
      title: d.title,
      subject: d.subject,
      createdAt: new Date(d.createdAt),
      updatedAt: d.updatedAt ? new Date(d.updatedAt) : null,
      priority: this.toDomainPriority(d.priority),
      stage: this.toDomainStage(d.stage),
    }));
  }

  private toSchemaPriority(priority: TicketPriority): TypeOrmTicketPriority {
    switch (priority) {
      case TicketPriority.Standard:
        return TypeOrmTicketPriority.Standard;
      case TicketPriority.Priority:
        return TypeOrmTicketPriority.Priority;
      case TicketPriority.Urgent:
        return TypeOrmTicketPriority.Urgent;
    }
  }

  private toSchemaStage(stage: TicketStage): TypeOrmTicketStage {
    switch (stage) {
      case TicketStage.Created:
        return TypeOrmTicketStage.Created;
      case TicketStage.InProgress:
        return TypeOrmTicketStage.InProgress;
      case TicketStage.Escalated:
        return TypeOrmTicketStage.Escalated;
      case TicketStage.Resolving:
        return TypeOrmTicketStage.Resolving;
      case TicketStage.Closed:
        return TypeOrmTicketStage.Closed;
    }

  }

  private toDomainPriority(priority: TypeOrmTicketPriority | string | number): TicketPriority {
    switch (priority) {
      case TypeOrmTicketPriority.Standard:
      case String(TicketPriority.Standard):
      case TicketPriority.Standard:
        return TicketPriority.Standard;
      case TypeOrmTicketPriority.Priority:
      case String(TicketPriority.Priority):
      case TicketPriority.Priority:
        return TicketPriority.Priority;
      case TypeOrmTicketPriority.Urgent:
      case String(TicketPriority.Urgent):
      case TicketPriority.Urgent:
        return TicketPriority.Urgent;
    }

    throw new Error(`Unknown TypeORM ticket priority: ${priority}`);
  }

  private toDomainStage(stage: TypeOrmTicketStage | string | number): TicketStage {
    switch (stage) {
      case TypeOrmTicketStage.Created:
      case String(TicketStage.Created):
      case TicketStage.Created:
        return TicketStage.Created;
      case TypeOrmTicketStage.InProgress:
      case String(TicketStage.InProgress):
      case TicketStage.InProgress:
        return TicketStage.InProgress;
      case TypeOrmTicketStage.Escalated:
      case String(TicketStage.Escalated):
      case TicketStage.Escalated:
        return TicketStage.Escalated;
      case TypeOrmTicketStage.Resolving:
      case String(TicketStage.Resolving):
      case TicketStage.Resolving:
        return TicketStage.Resolving;
      case TypeOrmTicketStage.Closed:
      case String(TicketStage.Closed):
      case TicketStage.Closed:
        return TicketStage.Closed;
    }

    throw new Error(`Unknown TypeORM ticket stage: ${stage}`);
  }
}
