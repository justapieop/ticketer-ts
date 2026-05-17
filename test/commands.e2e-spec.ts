import { createTestingApp } from './helpers/create-testing-app';
import { INestApplication } from '@nestjs/common';
import { TicketService } from 'src/modules/ticket/Ticket.service';
import { CreateTicketCommand } from 'src/infra/ticket/commands/CreateTicket.command';
import { ListTicketCommand } from 'src/infra/ticket/commands/ListTicket.command';
import { GetTicketCommand } from 'src/infra/ticket/commands/GetTicket.command';
import { EditTicketCommand } from 'src/infra/ticket/commands/EditTicket.command';
import { CliTicketPriority, CliTicketStage } from 'src/infra/ticket/commands/common';

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

    const ticketService = moduleRef.get(TicketService);

    // Create
    await createCmd.run([], { title: 'E2E title', subject: 'E2E subject', priority: CliTicketPriority.Standard });

    const ticketsAfterCreate = await ticketService.listTickets();
    expect(ticketsAfterCreate.length).toBe(1);
    const created = ticketsAfterCreate[0];
    expect(created.title).toBe('E2E title');
    expect(created.subject).toBe('E2E subject');

    // Get
    await getCmd.run([], { id: created.id });
    const fetched = await ticketService.getTicketById(created.id);
    expect(fetched).not.toBeNull();
    expect(fetched?.id).toBe(created.id);

    // Edit (change title and stage)
    await editCmd.run([], { id: created.id, title: 'E2E title edited', stage: CliTicketStage.InProgress });

    const afterEdit = await ticketService.getTicketById(created.id);
    expect(afterEdit).not.toBeNull();
    expect(afterEdit?.title).toBe('E2E title edited');
    expect(afterEdit?.stage).toBeDefined();
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
});
