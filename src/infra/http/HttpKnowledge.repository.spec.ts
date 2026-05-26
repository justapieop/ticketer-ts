import { Knowledge } from "src/domain/kb/Knowledge.domain";
import { HttpKnowledgeRepository } from "./HttpKnowledge.repository";

function createResponse(body: unknown, ok = true, status = 200) {
  return {
    ok,
    status,
    json: jest.fn().mockResolvedValue(body),
    text: jest.fn().mockResolvedValue(typeof body === "string" ? body : JSON.stringify(body)),
  };
}

describe("HttpKnowledgeRepository", () => {
  test("save posts an add payload", async () => {
    const fetcher = jest.fn().mockResolvedValue(createResponse({ ok: true }));
    const repository = new HttpKnowledgeRepository({ baseUrl: "http://kb.example.com", fetcher });
    const knowledge = Knowledge.reconstitute("doc-1", "Title", "Body", "/templates/email", ["template"]);

    await repository.save(knowledge);

    expect(fetcher).toHaveBeenCalledWith("http://kb.example.com/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Title",
        content: "Body",
        nodePath: "/templates/email",
        tags: ["template"],
      }),
    });
  });

  test("retrieve posts a docId and maps the response", async () => {
    const fetcher = jest.fn().mockResolvedValue(createResponse({
      id: "doc-2",
      title: "Retrieved",
      content: "Full content",
      nodePath: "/docs",
      tags: ["guide"],
    }));
    const repository = new HttpKnowledgeRepository({ baseUrl: "http://kb.example.com", fetcher });

    const result = await repository.retrieve("doc-2");

    expect(fetcher).toHaveBeenCalledWith("http://kb.example.com/retrieve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ docId: "doc-2" }),
    });
    expect(result).toMatchObject({
      id: "doc-2",
      title: "Retrieved",
      content: "Full content",
      nodePath: "/docs",
      tags: ["guide"],
    });
  });

  test("search hydrates partial results through retrieve calls", async () => {
    const fetcher = jest.fn()
      .mockResolvedValueOnce(createResponse({ results: [{ id: "doc-1", title: "Response Template" }] }))
      .mockResolvedValueOnce(createResponse({
        id: "doc-1",
        title: "Response Template",
        content: "Body 1",
        nodePath: "/templates/email",
        tags: ["template"],
      }));

    const repository = new HttpKnowledgeRepository({ baseUrl: "http://kb.example.com", fetcher });

    const results = await repository.search("response");

    expect(fetcher).toHaveBeenNthCalledWith(1, "http://kb.example.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: "response", topK: 5 }),
    });
    expect(fetcher).toHaveBeenNthCalledWith(2, "http://kb.example.com/retrieve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ docId: "doc-1" }),
    });
    expect(results).toHaveLength(1);
    expect(results[0].content).toBe("Body 1");
  });

  test("list uses the configured node path and limit", async () => {
    const fetcher = jest.fn()
      .mockResolvedValueOnce(createResponse({ results: [{ id: "doc-3", title: "Node item" }] }))
      .mockResolvedValueOnce(createResponse({
        id: "doc-3",
        title: "Node item",
        content: "Content 3",
        nodePath: "/team/devops",
        tags: [],
      }));

    const repository = new HttpKnowledgeRepository({
      baseUrl: "http://kb.example.com/",
      fetcher,
      defaultNodePath: "/team/devops",
      listLimit: 12,
    });

    const results = await repository.list();

    expect(fetcher).toHaveBeenNthCalledWith(1, "http://kb.example.com/list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nodePath: "/team/devops", limit: 12 }),
    });
    expect(results[0].id).toBe("doc-3");
  });

  test("throws when the API returns an error response", async () => {
    const fetcher = jest.fn().mockResolvedValue(createResponse({ error: "nope" }, false, 500));
    const repository = new HttpKnowledgeRepository({ baseUrl: "http://kb.example.com", fetcher });

    await expect(repository.retrieve("missing")).rejects.toThrow("KB API request to /retrieve failed with status 500");
  });
});