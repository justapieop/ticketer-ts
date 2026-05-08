import { Column, CreateDateColumn, Entity, Index, PrimaryColumn } from "typeorm";
import { TicketPriority, TicketStage } from "../domain/Ticket.schema";

@Entity({
  name: "tickets",
})
export class TypeOrmTicketSchema {
  @PrimaryColumn({
    type: "text",
  })
  public readonly id!: string;

  @Column({
    type: "text",
    nullable: false,
  })
  @Index()
  public title!: string;

  @Column({
    type: "text",
    nullable: false,
  })
  public subject!: string;

  @CreateDateColumn({
    type: "integer",
    nullable: false,
  })
  public createdAt!: Date;

  @CreateDateColumn({
    type: "integer",
    nullable: false,
  })
  public updatedAt!: Date;


  @Column({
    type: "text",
    enum: TicketPriority,
    enumName: "TicketPriority"
  })
  public priority!: TicketPriority;

  @Column({
    type: "text",
    enum: TicketPriority,
    enumName: "TicketPriority"
  })
  public stage!: TicketStage;
}