import { DataSource, EntityManager } from "typeorm";
import { Note } from "../typeorm/entity/Note";
import { injectable } from "inversify";
import { Tag } from "../typeorm/entity/Tag";

export interface DatabaseService {
  initialize(): Promise<void>;
  manager: EntityManager;
}

@injectable()
export default class DatabaseServiceImpl implements DatabaseService {
  private readonly appDataSource: DataSource;
  constructor() {
    this.appDataSource = new DataSource({
      type: "better-sqlite3",
      database: "dev.sqlite",
      entities: [Note, Tag],
      synchronize: true,
    });
  }
  async initialize(): Promise<void> {
    await this.appDataSource.initialize();
  }

  get manager(): EntityManager {
    return this.appDataSource.manager;
  }
}
