import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, SelectQueryBuilder } from "typeorm";
import { TicketRepository } from "../application/Ticket.repository";
import { TypeOrmTicketSchema } from "./TypeOrmTicket.schema";
import { Ticket, TicketPriority, TicketStage } from "../domain/Ticket.domain";
import { TicketMapper } from "./mappers/TicketMapper";

@Injectable()
export class TypeOrmTicketRepository implements TicketRepository {
  public constructor(
    @InjectRepository(TypeOrmTicketSchema)
    private readonly ticketRepository: Repository<TypeOrmTicketSchema>
  ) { }

  public async setTitle(id: string, title: string): Promise<void> {
    await this.ticketRepository.update(
      {
        id,
      },
      {
        title,
      },
    );
  }

  public async setSubject(id: string, subject: string): Promise<void> {
    await this.ticketRepository.update(
      {
        id,
      },
      {
        subject,
      },
    );
  }

  public async setPriority(id: string, priority: TicketPriority): Promise<void> {
    await this.ticketRepository.update(
      {
        id,
      },
      {
        priority: TicketMapper.toPersistencePriority(priority),
      },
    );
  }

  public async setStage(id: string, stage: TicketStage): Promise<void> {
    await this.ticketRepository.update(
      {
        id,
      },
      {
        stage: TicketMapper.toPersistenceStage(stage),
      },
    );
  }
  
  public async listTicket(): Promise<Ticket[]> {
    const entity: TypeOrmTicketSchema[] = await this.ticketRepository.find({
      order: {
        createdAt: "DESC",
      },
    });

    return entity.map((ticket) => TicketMapper.toDomain(ticket));
  }
  
  public async save(ticket: Ticket): Promise<Ticket> {
    const dbObj: TypeOrmTicketSchema = this.ticketRepository.create({
      id: ticket.id,
      title: ticket.title,
      subject: ticket.subject,
      priority: TicketMapper.toPersistencePriority(ticket.priority),
      stage: TicketMapper.toPersistenceStage(ticket.stage),
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
    });

    const queryBuilder: SelectQueryBuilder<TypeOrmTicketSchema> = this.ticketRepository.createQueryBuilder();

    await queryBuilder.insert().values(dbObj).orIgnore("").execute();
    const saved: TypeOrmTicketSchema | null = await this.ticketRepository.findOneBy({ id: ticket.id, });

    return saved ? TicketMapper.toDomain(saved) : ticket;
  }

  public async getTicketById(id: string): Promise<Ticket | null> {
    const entity: TypeOrmTicketSchema | null = await this.ticketRepository.findOneBy({ id, });

    if (!entity) {
      return null;
    }

    return TicketMapper.toDomain(entity);
  }
}
