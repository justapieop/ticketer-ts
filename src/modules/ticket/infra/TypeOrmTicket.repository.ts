import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, SelectQueryBuilder } from "typeorm";
import { TicketRepository } from "../app/Ticket.repository";
import { TypeOrmTicketSchema } from "./TypeOrmTicket.schema";
import { Ticket, TicketPriority, TicketStage } from "../domain/Ticket.domain";

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
        priority,
      },
    );
  }

  public async setStage(id: string, stage: TicketStage): Promise<void> {
    await this.ticketRepository.update({
      id,
    }, {
      stage,
    });
  }
  
  public async listTicket(): Promise<Ticket[]> {
    return await this.ticketRepository.find({
      order: {
        createdAt: "DESC",
      },
    });
  }
  
  public async save(ticket: Ticket): Promise<Ticket> {
    const dbObj: TypeOrmTicketSchema = this.ticketRepository.create(ticket);

    const queryBuilder: SelectQueryBuilder<TypeOrmTicketSchema> = this.ticketRepository.createQueryBuilder();

    await queryBuilder.insert().values(dbObj).orIgnore("").execute();
    const saved: TypeOrmTicketSchema | null = await this.ticketRepository.findOneBy({ id: ticket.id, });

    return saved ? this.toDomain(saved) : ticket;
  }

  public async getTicketById(id: string): Promise<Ticket | null> {
    return await this.ticketRepository.findOneBy({ id, });
  }

  private toDomain(ticketEntity: TypeOrmTicketSchema): Ticket {
    return new Ticket(
      ticketEntity.id,
      ticketEntity.title,
      ticketEntity.subject,
      ticketEntity.createdAt,
      ticketEntity.updatedAt,
      ticketEntity.priority,
      ticketEntity.stage
    );
  }
}