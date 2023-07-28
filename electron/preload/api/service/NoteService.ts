import { inject, injectable } from "inversify";
import { INJECTIONS } from "../injections";
import { Note } from "../typeorm/entity/Note";
import DatabaseService from "./DatabaseService";
import { DeepPartial, Repository } from "typeorm";

export interface NoteService {
  findAll(): Promise<Note[]>;
  create(): Promise<Note>;
  update(id: string, updates: DeepPartial<Note>): Promise<Note>;
}

@injectable()
export default class NoteServiceImpl implements NoteService {
  private readonly repository: Repository<Note>;
  constructor(
    @inject(INJECTIONS.DatabaseService)
    private readonly dataService: DatabaseService
  ) {
    dataService.initialize();
    this.repository = dataService.manager.getRepository(Note);
  }

  async findAll(): Promise<Note[]> {
    const notes = await this.repository.find();
    return notes;
  }

  async create(): Promise<Note> {
    const note = new Note();
    note.title = "";
    note.content = "";
    const created = await this.repository.save(note);
    return created;
  }

  async update(
    id: string,
    updates: DeepPartial<Note>
  ): Promise<Note> {
    const { title, content, tags } = updates;
    const updated = await this.repository.save({
      id,
      title,
      content,
      tags,
    });
    return updated;
  }
}
