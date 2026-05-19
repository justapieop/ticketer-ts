import { Column, Entity, Index, PrimaryColumn } from "typeorm";

export enum TypeOrmTicketPriority {
  Standard = "standard",
  Priority = "priority",
  Urgent = "urgent",
}

export enum TypeOrmTicketStage {
  Created = "created",
  InProgress = "in_progress",
  Escalated = "escalated",
  Resolving = "resolving",
  Closed = "closed",
}

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

  @Column({
    type: "integer",
    nullable: false,
  })
  public createdAt!: Date;

  @Column({
    type: "integer",
    nullable: true,
  })
  public updatedAt!: Date | null;

  @Column({
    type: "text",
    enum: TypeOrmTicketPriority,
    enumName: "TypeOrmTicketPriority"
  })
  public priority!: TypeOrmTicketPriority;

  @Column({
    type: "text",
    enum: TypeOrmTicketStage,
    enumName: "TypeOrmTicketStage"
  })
  public stage!: TypeOrmTicketStage;
}
