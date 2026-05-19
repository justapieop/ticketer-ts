import { TicketPriority, TicketStage } from "src/domain/ticket/Ticket.domain";
import {
  parseTicketPriority,
  parseTicketStage,
} from "./common";

describe("CLI parsing", () => {
  test("parseTicketPriority is case-insensitive", () => {
    expect(parseTicketPriority("STANDARD")).toBe(TicketPriority.Standard);
    expect(parseTicketPriority("priority")).toBe(TicketPriority.Priority);
    expect(parseTicketPriority("Urgent")).toBe(TicketPriority.Urgent);
  });

  test("parseTicketStage accepts separators and casing", () => {
    expect(parseTicketStage("inprogress")).toBe(TicketStage.InProgress);
    expect(parseTicketStage("In_Progress")).toBe(TicketStage.InProgress);
    expect(parseTicketStage("in-progress")).toBe(TicketStage.InProgress);
    expect(parseTicketStage("in progress")).toBe(TicketStage.InProgress);
  });

  test("parseTicketPriority throws on unknown input", () => {
    expect(() => parseTicketPriority("unknown")).toThrow(
      "Unknown ticket priority",
    );
  });

  test("parseTicketStage throws on unknown input", () => {
    expect(() => parseTicketStage("invalid")).toThrow(
      "Unknown ticket stage",
    );
  });
});
