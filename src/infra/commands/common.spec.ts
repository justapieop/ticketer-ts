import {
  CliTicketPriority,
  CliTicketStage,
  parseCliTicketPriority,
  parseCliTicketStage,
} from "./common";

describe("CLI parsing", () => {
  test("parseCliTicketPriority is case-insensitive", () => {
    expect(parseCliTicketPriority("STANDARD")).toBe(CliTicketPriority.Standard);
    expect(parseCliTicketPriority("priority")).toBe(CliTicketPriority.Priority);
    expect(parseCliTicketPriority("Urgent")).toBe(CliTicketPriority.Urgent);
  });

  test("parseCliTicketStage accepts separators and casing", () => {
    expect(parseCliTicketStage("inprogress")).toBe(CliTicketStage.InProgress);
    expect(parseCliTicketStage("In_Progress")).toBe(CliTicketStage.InProgress);
    expect(parseCliTicketStage("in-progress")).toBe(CliTicketStage.InProgress);
    expect(parseCliTicketStage("in progress")).toBe(CliTicketStage.InProgress);
  });

  test("parseCliTicketPriority throws on unknown input", () => {
    expect(() => parseCliTicketPriority("unknown")).toThrow(
      "Unknown CLI ticket priority",
    );
  });

  test("parseCliTicketStage throws on unknown input", () => {
    expect(() => parseCliTicketStage("invalid")).toThrow(
      "Unknown CLI ticket stage",
    );
  });
});
