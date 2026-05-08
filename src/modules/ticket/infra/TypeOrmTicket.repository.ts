import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, SelectQueryBuilder } from "typeorm";
import { TicketRepository } from "../app/Ticket.repository";
import { TypeOrmTicketSchema } from "./TypeOrmTicket.schema";
import { Ticket } from "../domain/Ticket.schema";

@Injectable()
export class TypeOrmTicketRepository implements TicketRepository {
  public constructor(
    @InjectRepository(TypeOrmTicketSchema)
    private readonly ticketRepository: Repository<TypeOrmTicketSchema>
  ) { }
  
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