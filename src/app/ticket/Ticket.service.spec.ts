import { TicketService } from './Ticket.service';
import { Ticket, TicketPriority, TicketStage } from '../../domain/ticket/Ticket.domain';

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

    const result = await svc.createTicket('t1', 's1', TicketPriority.Priority);

    expect(mockIdGen.generate).toHaveBeenCalled();
    expect(mockRepo.save).toHaveBeenCalled();
    expect(result.id).toBe('generated-id');
    expect(result.title).toBe('t1');
    expect(result.priority).toBe(TicketPriority.Priority);
    expect(result.stage).toBe(TicketStage.Created);
  });

  test('listTickets proxies to repository', async () => {
    const mockIdGen = { generate: jest.fn() };
    const sample = [new Ticket('1','a','b', new Date(), null, TicketPriority.Standard, TicketStage.Created)];
    const mockRepo = { save: jest.fn(), getTicketById: jest.fn(), listTicket: jest.fn().mockResolvedValue(sample) } as any;

    const svc = new TicketService(mockIdGen as any, mockRepo as any);

    const result = await svc.listTickets();

    expect(result).toBe(sample);
    expect(mockRepo.listTicket).toHaveBeenCalled();
  });
});
