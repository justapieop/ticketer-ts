import { InvalidKnowledgeDataError } from "./exceptions/InvalidKnowledgeData.error";

export class Knowledge {
  private constructor(
    public readonly id: string,
    public title: string,
    public content: string,
    public nodePath: string,
    public tags: string[],
  ) { }
  
  public static reconstitute(
    id: string,
    title: string,
    content: string,
    nodePath: string,
    tags: string[],
  ): Knowledge {
    return new Knowledge(
      id, title, content, nodePath, tags
    );
  }

  public static create(
    id: string,
    title: string,
    content: string,
    nodePath: string,
    tags: string[] = [],
  ): Knowledge {
    if (!title.trim()) {
      throw new InvalidKnowledgeDataError("Title cannot be empty.");
    }

    if (!content.trim()) {
      throw new InvalidKnowledgeDataError("Content cannot be empty.");
    }

    if (!nodePath.trim()) {
      throw new InvalidKnowledgeDataError("Node path cannot be empty.");
    }

    return new Knowledge(id, title, content, nodePath, tags);
  }
}