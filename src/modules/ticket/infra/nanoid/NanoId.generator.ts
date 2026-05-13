import { Injectable } from "@nestjs/common";
import { TicketIdGenerator } from "../../application/TicketId.generator";
import { nanoid } from "nanoid";

@Injectable()
export class NanoIdGenerator implements TicketIdGenerator {
  public generate(): string {
    return nanoid();
  }
}