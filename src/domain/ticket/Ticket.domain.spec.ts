import { Ticket, TicketPriority, TicketStage } from './Ticket.domain';
import { InvalidTicketDataError } from './exceptions/InvalidTicketData.error';

describe('Ticket domain', () => {
  test('create() produces a ticket with Created stage and current timestamp', () => {
    const t = Ticket.create('1', 'title', 'subject');
    expect(t.id).toBe('1');
    expect(t.title).toBe('title');
    expect(t.subject).toBe('subject');
    expect(t.priority).toBe(TicketPriority.Standard);
    expect(t.stage).toBe(TicketStage.Created);
    expect(t.createdAt).toBeInstanceOf(Date);
    expect(t.updatedAt).toBeNull();
  });

  test('create() accepts a custom priority', () => {
    const t = Ticket.create('1', 'title', 'subject', TicketPriority.Urgent);
    expect(t.priority).toBe(TicketPriority.Urgent);
  });

  test('create() rejects empty title', () => {
    expect(() => Ticket.create('1', '', 'subject')).toThrow(InvalidTicketDataError);
    expect(() => Ticket.create('1', '   ', 'subject')).toThrow(InvalidTicketDataError);
  });

  test('create() rejects empty subject', () => {
    expect(() => Ticket.create('1', 'title', '')).toThrow(InvalidTicketDataError);
    expect(() => Ticket.create('1', 'title', '   ')).toThrow(InvalidTicketDataError);
  });

  test('reconstitute() restores a ticket without validation', () => {
    const date = new Date(0);
    const t = Ticket.reconstitute('1', 'a', 's', date, null, TicketPriority.Standard, TicketStage.Closed);
    expect(t.id).toBe('1');
    expect(t.stage).toBe(TicketStage.Closed);
    expect(t.createdAt).toBe(date);
  });

  test('validateStageTransition allows valid transitions and rejects invalid ones', () => {
    // Allowed: Created -> InProgress
    expect(() => Ticket.validateStageTransition(TicketStage.Created, TicketStage.InProgress)).not.toThrow();

    // Disallowed: Created -> Closed
    expect(() => Ticket.validateStageTransition(TicketStage.Created, TicketStage.Closed)).toThrow(InvalidTicketDataError);
  });

  test('changeTitle and changeSubject update fields and touch updatedAt', () => {
    const t = Ticket.reconstitute('1', 'a', 's', new Date(0), null, TicketPriority.Standard, TicketStage.Created);

    const before = t.updatedAt;
    t.changeTitle('new title');
    t.changeSubject('new subject');

    expect(t.title).toBe('new title');
    expect(t.subject).toBe('new subject');
    expect(t.updatedAt).not.toBe(before);
  });

  test('changeTitle rejects empty title', () => {
    const t = Ticket.reconstitute('1', 'a', 's', new Date(0), null, TicketPriority.Standard, TicketStage.Created);
    expect(() => t.changeTitle('')).toThrow(InvalidTicketDataError);
    expect(() => t.changeTitle('   ')).toThrow(InvalidTicketDataError);
  });

  test('changeSubject rejects empty subject', () => {
    const t = Ticket.reconstitute('1', 'a', 's', new Date(0), null, TicketPriority.Standard, TicketStage.Created);
    expect(() => t.changeSubject('')).toThrow(InvalidTicketDataError);
    expect(() => t.changeSubject('   ')).toThrow(InvalidTicketDataError);
  });

  test('changeStage enforces stage transition validation', () => {
    const t = Ticket.reconstitute('1', 'a', 's', new Date(0), null, TicketPriority.Standard, TicketStage.Created);

    // valid
    expect(() => t.changeStage(TicketStage.InProgress)).not.toThrow();

    // invalid transition (Created -> Closed)
    const t2 = Ticket.reconstitute('2', 'b', 's', new Date(0), null, TicketPriority.Standard, TicketStage.Created);
    expect(() => t2.changeStage(TicketStage.Closed)).toThrow(InvalidTicketDataError);
  });
});
