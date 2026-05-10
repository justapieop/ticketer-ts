import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from "typeorm";

export enum TypeOrmTicketPriority {
  Standard,
  Priority,
  Urgent,
}

export enum TypeOrmTicketStage {
  Created,
  InProgress,
  Escalated,
  Resolving,
  Closed,
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
