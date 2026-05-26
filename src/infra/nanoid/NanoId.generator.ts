import { Injectable } from "@nestjs/common";
import { nanoid } from "nanoid";
import { KnowledgeIdGenerator } from "src/domain/kb/ports/KnowledgeId.generator";
import { TicketIdGenerator } from "src/domain/ticket/ports/TicketIdGenerator.port";

@Injectable()
export class NanoIdGenerator implements TicketIdGenerator, KnowledgeIdGenerator {
  public generate(): string {
    return nanoid();
  }
}