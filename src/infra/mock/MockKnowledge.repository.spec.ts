import { Knowledge } from "src/domain/kb/Knowledge.domain";
import { MockKnowledgeRepository } from "./MockKnowledge.repository";

describe("MockKnowledgeRepository", () => {
  test("save stores knowledge and list returns stored items", async () => {
    const repository = new MockKnowledgeRepository();
    const knowledge = Knowledge.reconstitute(
      "doc-1",
      "Customer Response Template",
      "content",
      "/templates/email",
      ["template", "email"],
    );

    await repository.save(knowledge);

    const items = await repository.list();

    expect(items).toHaveLength(1);
    expect(items[0]).not.toBe(knowledge);
    expect(items[0]).toMatchObject({
      id: "doc-1",
      title: "Customer Response Template",
      content: "content",
      nodePath: "/templates/email",
      tags: ["template", "email"],
    });
  });

  test("search filters by title and retrieve returns a stored item", async () => {
    const repository = new MockKnowledgeRepository();
    const first = Knowledge.reconstitute("doc-1", "Response Template", "content-1", "/templates/email", ["template"]);
    const second = Knowledge.reconstitute("doc-2", "Other Document", "content-2", "/docs/misc", ["misc"]);

    await repository.save(first);
    await repository.save(second);

    const results = await repository.search("Response");
    const retrieved = await repository.retrieve("doc-2");

    expect(results).toHaveLength(1);
    expect(results[0].id).toBe("doc-1");
    expect(retrieved.id).toBe("doc-2");
    expect(retrieved.title).toBe("Other Document");
  });

  test("retrieve throws for missing knowledge", async () => {
    const repository = new MockKnowledgeRepository();

    await expect(repository.retrieve("missing-id")).rejects.toThrow("Knowledge with id missing-id not found");
  });
});