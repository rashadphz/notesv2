import { DataSource, EntityManager } from "typeorm";
import { Note } from "../typeorm/entity/Note";
import { injectable } from "inversify";

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
      database: "app.sqlite",
      entities: [Note],
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
