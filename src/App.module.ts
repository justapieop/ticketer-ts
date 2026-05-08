import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "better-sqlite3",
      database: "data.db",
      autoLoadEntities: true,
      cache: true,
      synchronize: true,
    }),
  ],
})
export class AppModule {}