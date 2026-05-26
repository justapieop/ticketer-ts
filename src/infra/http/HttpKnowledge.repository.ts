import { Knowledge } from "src/domain/kb/Knowledge.domain";
import { KnowledgeRepository } from "src/domain/kb/ports/Knowledge.repository";

export interface HttpKnowledgeRepositoryOptions {
  baseUrl: string;
  fetcher?: HttpFetchLike;
  defaultNodePath?: string;
  searchTopK?: number;
  listLimit?: number;
}

export interface HttpFetchResponseLike {
  ok: boolean;
  status: number;
  json(): Promise<any>;
  text(): Promise<string>;
}

export interface HttpFetchLike {
  (input: string, init?: {
    method?: string;
    headers?: Record<string, string>;
    body?: string;
  }): Promise<HttpFetchResponseLike>;
}

interface KnowledgeSummaryResponse {
  id: string;
  title: string;
  content?: string;
  nodePath?: string;
  tags?: string[];
}

interface SearchResponse {
  results?: KnowledgeSummaryResponse[];
}

interface ListResponse {
  results?: KnowledgeSummaryResponse[];
}

interface RetrieveResponse {
  id: string;
  title: string;
  content: string;
  nodePath: string;
  tags: string[];
}

export class HttpKnowledgeRepository implements KnowledgeRepository {
  private readonly baseUrl: string;
  private readonly fetcher: HttpFetchLike;
  private readonly defaultNodePath: string;
  private readonly searchTopK: number;
  private readonly listLimit: number;

  public constructor(options: HttpKnowledgeRepositoryOptions) {
    this.baseUrl = options.baseUrl.replace(/\/+$/, "");
    this.fetcher = options.fetcher ?? globalThis.fetch.bind(globalThis);
    this.defaultNodePath = options.defaultNodePath ?? "/";
    this.searchTopK = options.searchTopK ?? 5;
    this.listLimit = options.listLimit ?? 10;
  }

  public async save(knowledge: Knowledge): Promise<void> {
    await this.postJson("/add", {
      title: knowledge.title,
      content: knowledge.content,
      nodePath: knowledge.nodePath,
      tags: knowledge.tags,
    });
  }

  public async search(title: string, topK?: number): Promise<Knowledge[]> {
    const response = await this.postJson<SearchResponse>("/search", {
      query: title,
      topK: topK ?? this.searchTopK,
    });

    return this.hydrateSummaries(response.results ?? []);
  }

  public async list(nodePath?: string, limit?: number): Promise<Knowledge[]> {
    const response = await this.postJson<ListResponse>("/list", {
      nodePath: nodePath ?? this.defaultNodePath,
      limit: limit ?? this.listLimit,
    });

    return this.hydrateSummaries(response.results ?? []);
  }

  public async retrieve(id: string): Promise<Knowledge> {
    const response = await this.postJson<RetrieveResponse>("/retrieve", {
      docId: id,
    });

    return Knowledge.reconstitute(
      response.id,
      response.title,
      response.content,
      response.nodePath,
      response.tags,
    );
  }

  private async hydrateSummaries(records: KnowledgeSummaryResponse[]): Promise<Knowledge[]> {
    return Promise.all(records.map(async (record) => {
      if (
        typeof record.content === "string"
        && typeof record.nodePath === "string"
        && Array.isArray(record.tags)
      ) {
        return Knowledge.reconstitute(
          record.id,
          record.title,
          record.content,
          record.nodePath,
          record.tags,
        );
      }

      return this.retrieve(record.id);
    }));
  }

  private async postJson<TResponse>(path: string, body: Record<string, unknown>): Promise<TResponse> {
    const response = await this.fetcher(this.buildUrl(path), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`KB API request to ${path} failed with status ${response.status}: ${await this.readResponseText(response)}`);
    }

    return response.json() as Promise<TResponse>;
  }

  private buildUrl(path: string): string {
    return `${this.baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
  }

  private async readResponseText(response: HttpFetchResponseLike): Promise<string> {
    try {
      return await response.text();
    } catch {
      return "<unavailable>";
    }
  }
}