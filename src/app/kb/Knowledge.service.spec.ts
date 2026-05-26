import { Knowledge } from "src/domain/kb/Knowledge.domain";
import { KnowledgeService } from "./Knowledge.service";

describe("KnowledgeService", () => {
  test("delegates search, list, retrieve, and save to the repository", async () => {
    const repository = {
      search: jest.fn().mockResolvedValue([Knowledge.reconstitute("doc-1", "Title", "content", "/node", [])]),
      list: jest.fn().mockResolvedValue([]),
      retrieve: jest.fn().mockResolvedValue(Knowledge.reconstitute("doc-2", "Other", "content", "/node", [])),
      save: jest.fn().mockResolvedValue(undefined),
    } as any;

    const service = new KnowledgeService(repository);
    const sample = Knowledge.reconstitute("doc-3", "Saved", "content", "/node", ["tag"]);

    const searchResult = await service.search("Title");
    const listResult = await service.list();
    const retrieveResult = await service.retrieve("doc-2");
    await service.save(sample);

    expect(searchResult).toHaveLength(1);
    expect(listResult).toEqual([]);
    expect(retrieveResult.id).toBe("doc-2");
    expect(repository.search).toHaveBeenCalledWith("Title", undefined);
    expect(repository.list).toHaveBeenCalled();
    expect(repository.retrieve).toHaveBeenCalledWith("doc-2");
    expect(repository.save).toHaveBeenCalledWith(sample);
  });
});