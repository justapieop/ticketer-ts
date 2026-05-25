import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TicketModule } from "./Ticket.module";
import { KnowledgeModule } from "./Knowledge.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "better-sqlite3",
      database: "data.db",
      autoLoadEntities: true,
      cache: true,
      synchronize: true,
    }),
    TicketModule,
    KnowledgeModule,
  ],
})
export class AppModule {}