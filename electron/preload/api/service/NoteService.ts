import { inject, injectable } from "inversify";
import { INJECTIONS } from "../injections";
import { Note } from "../typeorm/entity/Note";
import DatabaseService from "./DatabaseService";
import { Repository } from "typeorm";

export interface NoteService {
  findAll(): Promise<Note[]>;
  create(): Promise<Note>;
  update(id: string, updates: Partial<Note>): Promise<Note>;
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
    console.log("findAll");
    const notes = await this.repository.find();
    console.log("notes", notes);
    return notes;
  }

  async create(): Promise<Note> {
    const note = new Note();
    note.title = "";
    note.content = "";
    const created = await this.repository.save(note);
    return created;
  }

  async update(id: string, updates: Partial<Note>): Promise<Note> {
    const { title, content } = updates;
    const updated = await this.repository.save({
      id,
      title,
      content,
    });
    return updated;
  }
}
