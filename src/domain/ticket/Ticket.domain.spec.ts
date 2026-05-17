import { Ticket, TicketPriority, TicketStage, TicketEditor } from './Ticket.domain';
import { InvalidPriorityInput } from './exceptions/InvalidPriorityInput.error';
import { InvalidStageInput } from './exceptions/InvalidStageInput.error';
import { InvalidTicketDataError } from './exceptions/InvalidTicketData.error';

describe('Ticket domain', () => {
  test('parsePriority accepts known names (case-insensitive)', () => {
    expect(Ticket.parsePriority('standard')).toBe(TicketPriority.Standard);
    expect(Ticket.parsePriority('Priority')).toBe(TicketPriority.Priority);
    expect(Ticket.parsePriority('URGENT')).toBe(TicketPriority.Urgent);
  });

  test('parsePriority throws on unknown input', () => {
    expect(() => Ticket.parsePriority('unknown')).toThrow(InvalidPriorityInput);
  });

  test('parseStage accepts known names (case-insensitive)', () => {
    expect(Ticket.parseStage('created')).toBe(TicketStage.Created);
    expect(Ticket.parseStage('inprogress')).toBe(TicketStage.InProgress);
    expect(Ticket.parseStage('resolving')).toBe(TicketStage.Resolving);
    expect(Ticket.parseStage('closed')).toBe(TicketStage.Closed);
  });

  test('parseStage throws on unknown input', () => {
    expect(() => Ticket.parseStage('invalid')).toThrow(InvalidStageInput);
  });

  test('validateStageTransition allows valid transitions and rejects invalid ones', () => {
    // Allowed: Created -> InProgress
    expect(() => Ticket.validateStageTransition(TicketStage.Created, TicketStage.InProgress)).not.toThrow();

    // Disallowed: Created -> Closed
    expect(() => Ticket.validateStageTransition(TicketStage.Created, TicketStage.Closed)).toThrow(InvalidTicketDataError);
  });

  test('TicketEditor updates fields and touch updatedAt', () => {
    const t = new Ticket('1', 'a', 's', new Date(0), null, TicketPriority.Standard, TicketStage.Created);
    const editor = t.edit();

    const before = t.updatedAt;
    editor.setTitle('new title').setSubject('new subject');

    expect(t.title).toBe('new title');
    expect(t.subject).toBe('new subject');
    expect(t.updatedAt).not.toBe(before);
  });

  test('TicketEditor enforces stage transition validation', () => {
    const t = new Ticket('1', 'a', 's', new Date(0), null, TicketPriority.Standard, TicketStage.Created);
    const editor = t.edit();

    // valid
    expect(() => editor.setStage(TicketStage.InProgress)).not.toThrow();

    // invalid transition (Created -> Closed)
    const t2 = new Ticket('2', 'b', 's', new Date(0), null, TicketPriority.Standard, TicketStage.Created);
    const editor2 = t2.edit();
    expect(() => editor2.setStage(TicketStage.Closed)).toThrow(InvalidTicketDataError);
  });
});
