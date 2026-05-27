import { Injectable } from "@nestjs/common";
import { nanoid } from "nanoid";
import { KnowledgeIdGenerator } from "src/app/kb/ports/KnowledgeId.generator";
import { TicketIdGenerator } from "src/app/ticket/ports/TicketIdGenerator.port";

@Injectable()
export class NanoIdGenerator implements TicketIdGenerator, KnowledgeIdGenerator {
  public generate(): string {
    return nanoid();
  }
}