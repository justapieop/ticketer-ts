import { Ticket, TicketPriority, TicketStage } from "../../domain/Ticket.domain";
import { TypeOrmTicketSchema, TypeOrmTicketPriority, TypeOrmTicketStage } from "../typeorm/TypeOrmTicket.schema";

export class TicketMapper {
  public static toPersistencePriority(priority: TicketPriority): TypeOrmTicketPriority {
    return priority as unknown as TypeOrmTicketPriority;
  }

  public static toPersistenceStage(stage: TicketStage): TypeOrmTicketStage {
    return stage as unknown as TypeOrmTicketStage;
  }

  public static toDomainPriority(priority: TypeOrmTicketPriority): TicketPriority {
    return priority as unknown as TicketPriority;
  }

  public static toDomainStage(stage: TypeOrmTicketStage): TicketStage {
    return stage as unknown as TicketStage;
  }

  public static toDomain(entity: TypeOrmTicketSchema): Ticket {
    return new Ticket(
      entity.id,
      entity.title,
      entity.subject,
      entity.createdAt,
      entity.updatedAt,
      this.toDomainPriority(entity.priority),
      this.toDomainStage(entity.stage),
    );
  }
}
