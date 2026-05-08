import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from "typeorm";
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

  @UpdateDateColumn({
    type: "integer",
    nullable: true,
  })
  public updatedAt!: Date | null;


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