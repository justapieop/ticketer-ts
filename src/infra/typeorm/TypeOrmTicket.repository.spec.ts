import { TypeOrmTicketRepository } from './TypeOrmTicket.repository';
import { TypeOrmTicketPriority, TypeOrmTicketStage } from './TypeOrmTicket.schema';
import { Ticket, TicketPriority, TicketStage } from 'src/domain/ticket/Ticket.domain';

describe('TypeOrmTicketRepository', () => {
  let mockRepo: any;
  let repo: TypeOrmTicketRepository;

  beforeEach(() => {
    mockRepo = {
      create: jest.fn().mockImplementation((o) => ({ ...o })),
      createQueryBuilder: jest.fn(),
      findOneBy: jest.fn(),
      find: jest.fn(),
    };

    const qb = {
      insert: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      orUpdate: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue({}),
    };

    mockRepo.createQueryBuilder.mockReturnValue(qb);

    repo = new TypeOrmTicketRepository(mockRepo);
  });

  test('save creates schema and executes upsert, returns ticket', async () => {
    const ticket = new Ticket('t-1', 'title', 'subject', new Date(0), null, TicketPriority.Urgent, TicketStage.Resolving);

    await expect(repo.save(ticket)).resolves.toBe(ticket);

    expect(mockRepo.create).toHaveBeenCalledWith({
      id: ticket.id,
      title: ticket.title,
      subject: ticket.subject,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
      priority: expect.any(Number),
      stage: expect.any(Number),
    });

    const qb = mockRepo.createQueryBuilder();
    expect(qb.insert).toHaveBeenCalled();
    expect(qb.values).toHaveBeenCalled();
    expect(qb.orUpdate).toHaveBeenCalled();
    expect(qb.execute).toHaveBeenCalled();
  });

  test('getTicketById returns mapped Ticket when found', async () => {
    const schema = {
      id: 't-2',
      title: 'T2',
      subject: 'S2',
      createdAt: new Date(0),
      updatedAt: null,
      priority: TypeOrmTicketPriority.Priority,
      stage: TypeOrmTicketStage.InProgress,
    };

    mockRepo.findOneBy.mockResolvedValue(schema);

    const result = await repo.getTicketById('t-2');

    expect(result).not.toBeNull();
    expect(result?.id).toBe(schema.id);
    expect(result?.title).toBe(schema.title);
    expect(result?.priority).toBe(TicketPriority.Priority);
    expect(result?.stage).toBe(TicketStage.InProgress);
  });

  test('getTicketById returns null when not found', async () => {
    mockRepo.findOneBy.mockResolvedValue(null);
    const result = await repo.getTicketById('missing');
    expect(result).toBeNull();
  });

  test('listTicket maps all schemas to Tickets', async () => {
    const schemas = [
      {
        id: 'a', title: 'A', subject: 'a', createdAt: new Date(0), updatedAt: null,
        priority: TypeOrmTicketPriority.Standard, stage: TypeOrmTicketStage.Created,
      },
      {
        id: 'b', title: 'B', subject: 'b', createdAt: new Date(0), updatedAt: null,
        priority: TypeOrmTicketPriority.Urgent, stage: TypeOrmTicketStage.Closed,
      },
    ];

    mockRepo.find.mockResolvedValue(schemas);

    const result = await repo.listTicket();

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('a');
    expect(result[0].priority).toBe(TicketPriority.Standard);
    expect(result[1].stage).toBe(TicketStage.Closed);
  });
});
