import { INestApplication } from '@nestjs/common';
import { CreateTicketCommand } from 'src/infra/commands/CreateTicket.command';
import { ListTicketCommand } from 'src/infra/commands/ListTicket.command';
import { GetTicketCommand } from 'src/infra/commands/GetTicket.command';
import { EditTicketCommand } from 'src/infra/commands/EditTicket.command';
import { TicketPriority, TicketStage } from 'src/domain/ticket/Ticket.domain';
import { createTestingApp } from './helpers/create-testing-app';
import { TICKET_USE_CASES, type TicketUseCases } from 'src/domain/ticket/ports/TicketUseCases.port';

describe('Commands E2E', () => {
  let app: INestApplication;
  let moduleRef: any;

  beforeAll(async () => {
    const res = await createTestingApp();
    app = res.app;
    moduleRef = res.moduleRef;
  });

  afterAll(async () => {
    await app.close();
  });

  test('create -> list -> get -> edit flow', async () => {
    const createCmd = moduleRef.get(CreateTicketCommand);
    const listCmd = moduleRef.get(ListTicketCommand);
    const getCmd = moduleRef.get(GetTicketCommand);
    const editCmd = moduleRef.get(EditTicketCommand);

    const ticketUseCases: TicketUseCases = moduleRef.get(TICKET_USE_CASES);

    // Create
    await createCmd.run([], { title: 'E2E title', subject: 'E2E subject', priority: TicketPriority.Standard });

    const ticketsAfterCreate = await ticketUseCases.listTickets();
    expect(ticketsAfterCreate.length).toBe(1);
    const created = ticketsAfterCreate[0];
    expect(created.title).toBe('E2E title');
    expect(created.subject).toBe('E2E subject');

    // Get
    await getCmd.run([], { id: created.id });
    const fetched = await ticketUseCases.getTicketById(created.id);
    expect(fetched).not.toBeNull();
    expect(fetched?.id).toBe(created.id);

    // Edit (change title and stage)
    await editCmd.run([], { id: created.id, title: 'E2E title edited', stage: TicketStage.InProgress });

    const afterEdit = await ticketUseCases.getTicketById(created.id);
    expect(afterEdit).not.toBeNull();
    expect(afterEdit?.title).toBe('E2E title edited');
    expect(afterEdit?.stage).toBe(TicketStage.InProgress);
  });

  test('list prints no tickets when empty DB', async () => {
    // Close and recreate a fresh app to get empty DB
    await app.close();
    const res = await createTestingApp();
    app = res.app;
    moduleRef = res.moduleRef;

    const listCmd = moduleRef.get(ListTicketCommand);

    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    await listCmd.run([], {});
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  test('get prints error for missing ticket', async () => {
    const getCmd = moduleRef.get(GetTicketCommand);

    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    await getCmd.run([], { id: 'missing-id' });
    expect(spy).toHaveBeenCalledWith('Error: Ticket with id missing-id not found');
    spy.mockRestore();
  });
});
