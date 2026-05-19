import { CommandFactory } from "nest-commander";
import { AppModule } from "./infra/nest/App.module";

async function start(): Promise<void> {
  await CommandFactory.run(AppModule);
}

start();