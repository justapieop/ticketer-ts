import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TicketModule } from "./modules/Ticket.module";

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
  ],
})
export class AppModule {}