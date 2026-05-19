import { Injectable } from "@nestjs/common";
import { nanoid } from "nanoid";
import { TicketIdGenerator } from "src/domain/ticket/ports/TicketIdGenerator.port";

@Injectable()
export class NanoIdGenerator implements TicketIdGenerator {
  public generate(): string {
    return nanoid();
  }
}