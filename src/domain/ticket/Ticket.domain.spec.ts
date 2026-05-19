import { Ticket, TicketPriority, TicketStage, TicketEditor } from './Ticket.domain';
import { InvalidTicketDataError } from './exceptions/InvalidTicketData.error';

describe('Ticket domain', () => {
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
