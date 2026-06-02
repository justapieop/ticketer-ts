import { TicketService } from './Ticket.service';
import { Ticket, TicketPriority, TicketStage } from '../../domain/ticket';
import { TicketNotFoundError } from './exceptions/TicketNotFound.error';
import { CreateTicketInput } from './ports/inputs/CreateTicket.input';
import { EditTicketInput } from './ports/inputs/EditTicket.input';

describe('TicketService', () => {
  test('createTicket generates id, saves and returns ticket', async () => {
    const mockIdGen = { generate: jest.fn().mockReturnValue('generated-id') };
    const saved: Ticket[] = [];
    const mockRepo = {
      save: jest.fn().mockImplementation(async (t: Ticket) => { saved.push(t); return t; }),
      getTicketById: jest.fn().mockResolvedValue(null),
      listTicket: jest.fn().mockResolvedValue([]),
    } as any;

    const svc = new TicketService(mockIdGen as any, mockRepo as any);

    const result = await svc.createTicket(new CreateTicketInput('t1', 's1', TicketPriority.Priority));

    expect(mockIdGen.generate).toHaveBeenCalled();
    expect(mockRepo.save).toHaveBeenCalled();
    expect(result.id).toBe('generated-id');
    expect(result.title).toBe('t1');
    expect(result.priority).toBe(TicketPriority.Priority);
    expect(result.stage).toBe(TicketStage.Created);
  });

  test('listTickets proxies to repository', async () => {
    const mockIdGen = { generate: jest.fn() };
    const sample = [Ticket.reconstitute('1', 'a', 'b', new Date(), null, TicketPriority.Standard, TicketStage.Created)];
    const mockRepo = { save: jest.fn(), getTicketById: jest.fn(), listTicket: jest.fn().mockResolvedValue(sample) } as any;

    const svc = new TicketService(mockIdGen as any, mockRepo as any);

    const result = await svc.listTickets();

    expect(result).toBe(sample);
    expect(mockRepo.listTicket).toHaveBeenCalled();
  });

  test('editTicket applies changes and saves through repository', async () => {
    const mockIdGen = { generate: jest.fn() };
    const ticket = Ticket.reconstitute('1', 'old', 'subject', new Date(0), null, TicketPriority.Priority, TicketStage.Created);
    const mockRepo = {
      save: jest.fn().mockImplementation(async (t: Ticket) => t),
      getTicketById: jest.fn().mockResolvedValue(ticket),
      listTicket: jest.fn(),
    } as any;

    const svc = new TicketService(mockIdGen as any, mockRepo as any);

    const result = await svc.editTicket(new EditTicketInput(
      '1',
      'new',
      undefined,
      TicketPriority.Standard,
      TicketStage.InProgress,
    ));

    expect(result).toBe(ticket);
    expect(ticket.title).toBe('new');
    expect(ticket.priority).toBe(TicketPriority.Standard);
    expect(ticket.stage).toBe(TicketStage.InProgress);
    expect(ticket.updatedAt).not.toBeNull();
    expect(mockRepo.save).toHaveBeenCalledWith(ticket);
  });

  test('editTicket throws TicketNotFoundError when ticket is missing', async () => {
    const mockIdGen = { generate: jest.fn() };
    const mockRepo = {
      save: jest.fn(),
      getTicketById: jest.fn().mockResolvedValue(null),
      listTicket: jest.fn(),
    } as any;

    const svc = new TicketService(mockIdGen as any, mockRepo as any);

    await expect(svc.editTicket(new EditTicketInput('missing', 'new'))).rejects.toThrow(TicketNotFoundError);
    expect(mockRepo.save).not.toHaveBeenCalled();
  });

  test('getTicketById throws TicketNotFoundError when ticket is missing', async () => {
    const mockIdGen = { generate: jest.fn() };
    const mockRepo = {
      save: jest.fn(),
      getTicketById: jest.fn().mockResolvedValue(null),
      listTicket: jest.fn(),
    } as any;

    const svc = new TicketService(mockIdGen as any, mockRepo as any);

    await expect(svc.getTicketById('missing')).rejects.toThrow(TicketNotFoundError);
    expect(mockRepo.getTicketById).toHaveBeenCalledWith('missing');
  });
});
