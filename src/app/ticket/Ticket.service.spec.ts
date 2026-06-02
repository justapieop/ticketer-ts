import { TicketService } from './Ticket.service';
import { Ticket, TicketPriority, TicketStage } from '../../domain/ticket';
import { TicketDto } from './dto/Ticket.dto';
import { TicketNotFoundError } from './exceptions/TicketNotFound.error';
import { CreateTicketInput } from './ports/inputs/CreateTicket.input';

describe('TicketService', () => {
  test('createTicket generates id, saves and returns TicketDto', async () => {
    const mockIdGen = { generate: jest.fn().mockReturnValue('generated-id') };
    const saved: Ticket[] = [];
    const mockRepo = {
      save: jest.fn().mockImplementation(async (t: Ticket) => { saved.push(t); return t; }),
      getTicketById: jest.fn().mockResolvedValue(null),
      listTicket: jest.fn().mockResolvedValue([]),
    } as any;

    const svc = new TicketService(mockIdGen as any, mockRepo as any);

    const result = await svc.createTicket(new CreateTicketInput('t1', 's1', TicketPriority.Priority));

    expect(result).toBeInstanceOf(TicketDto);
    expect(mockIdGen.generate).toHaveBeenCalled();
    expect(mockRepo.save).toHaveBeenCalled();
    expect(result.id).toBe('generated-id');
    expect(result.title).toBe('t1');
    expect(result.priority).toBe(TicketPriority.Priority);
    expect(result.stage).toBe(TicketStage.Created);
  });

  test('listTickets returns TicketDto array', async () => {
    const mockIdGen = { generate: jest.fn() };
    const sample = [Ticket.reconstitute('1', 'a', 'b', new Date(), null, TicketPriority.Standard, TicketStage.Created)];
    const mockRepo = { save: jest.fn(), getTicketById: jest.fn(), listTicket: jest.fn().mockResolvedValue(sample) } as any;

    const svc = new TicketService(mockIdGen as any, mockRepo as any);

    const result = await svc.listTickets();

    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(TicketDto);
    expect(result[0].id).toBe('1');
  });

  test('reviseTicketContent returns TicketDto with updated content', async () => {
    const mockIdGen = { generate: jest.fn() };
    const ticket = Ticket.reconstitute('1', 'old title', 'old subject', new Date(0), null, TicketPriority.Standard, TicketStage.Created);
    const mockRepo = {
      save: jest.fn().mockImplementation(async (t: Ticket) => t),
      getTicketById: jest.fn().mockResolvedValue(ticket),
      listTicket: jest.fn(),
    } as any;

    const svc = new TicketService(mockIdGen as any, mockRepo as any);

    const result = await svc.reviseTicketContent('1', 'new title', 'new subject');

    expect(result).toBeInstanceOf(TicketDto);
    expect(result.title).toBe('new title');
    expect(result.subject).toBe('new subject');
    expect(result.updatedAt).not.toBeNull();
  });

  test('changeTicketPriority returns TicketDto with updated priority', async () => {
    const mockIdGen = { generate: jest.fn() };
    const ticket = Ticket.reconstitute('1', 'a', 'b', new Date(0), null, TicketPriority.Standard, TicketStage.Created);
    const mockRepo = {
      save: jest.fn().mockImplementation(async (t: Ticket) => t),
      getTicketById: jest.fn().mockResolvedValue(ticket),
      listTicket: jest.fn(),
    } as any;

    const svc = new TicketService(mockIdGen as any, mockRepo as any);

    const result = await svc.changeTicketPriority('1', TicketPriority.Urgent);

    expect(result).toBeInstanceOf(TicketDto);
    expect(result.priority).toBe(TicketPriority.Urgent);
  });

  test('advanceTicketStage returns TicketDto with updated stage', async () => {
    const mockIdGen = { generate: jest.fn() };
    const ticket = Ticket.reconstitute('1', 'a', 'b', new Date(0), null, TicketPriority.Standard, TicketStage.Created);
    const mockRepo = {
      save: jest.fn().mockImplementation(async (t: Ticket) => t),
      getTicketById: jest.fn().mockResolvedValue(ticket),
      listTicket: jest.fn(),
    } as any;

    const svc = new TicketService(mockIdGen as any, mockRepo as any);

    const result = await svc.advanceTicketStage('1', TicketStage.InProgress);

    expect(result).toBeInstanceOf(TicketDto);
    expect(result.stage).toBe(TicketStage.InProgress);
  });

  test('advanceTicketStage throws TicketNotFoundError when ticket is missing', async () => {
    const mockIdGen = { generate: jest.fn() };
    const mockRepo = {
      save: jest.fn(),
      getTicketById: jest.fn().mockResolvedValue(null),
      listTicket: jest.fn(),
    } as any;

    const svc = new TicketService(mockIdGen as any, mockRepo as any);

    await expect(svc.advanceTicketStage('missing', TicketStage.InProgress)).rejects.toThrow(TicketNotFoundError);
    expect(mockRepo.save).not.toHaveBeenCalled();
  });

  test('getTicketById returns TicketDto', async () => {
    const mockIdGen = { generate: jest.fn() };
    const ticket = Ticket.reconstitute('1', 'a', 'b', new Date(0), null, TicketPriority.Standard, TicketStage.Created);
    const mockRepo = {
      save: jest.fn(),
      getTicketById: jest.fn().mockResolvedValue(ticket),
      listTicket: jest.fn(),
    } as any;

    const svc = new TicketService(mockIdGen as any, mockRepo as any);

    const result = await svc.getTicketById('1');

    expect(result).toBeInstanceOf(TicketDto);
    expect(result.id).toBe('1');
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
