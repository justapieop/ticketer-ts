import { Injectable } from "@nestjs/common";
import { nanoid } from "nanoid";
import { TicketIdGenerator } from "src/app/ticket/TicketId.generator";

@Injectable()
export class NanoIdGenerator implements TicketIdGenerator {
  public generate(): string {
    return nanoid();
  }
}