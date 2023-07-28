import { inject, injectable } from "inversify";
import { INJECTIONS } from "../injections";
import { Note } from "../typeorm/entity/Note";
import DatabaseService from "./DatabaseService";
import { DeepPartial, In, Repository } from "typeorm";
import { Tag } from "../typeorm/entity/Tag";

export interface NoteService {
  findAll(): Promise<Note[]>;
  create(): Promise<Note>;
  update(id: string, updates: DeepPartial<Note>): Promise<Note>;
}

@injectable()
export default class NoteServiceImpl implements NoteService {
  private readonly noteRepo: Repository<Note>;
  private readonly tagRepo: Repository<Tag>;

  constructor(
    @inject(INJECTIONS.DatabaseService)
    private readonly dataService: DatabaseService
  ) {
    dataService.initialize();
    this.noteRepo = dataService.manager.getRepository(Note);
    this.tagRepo = dataService.manager.getRepository(Tag);
  }

  async findAll(): Promise<Note[]> {
    const notes = await this.noteRepo.find();
    console.log("notes", notes);
    return notes;
  }

  async create(): Promise<Note> {
    const note = new Note();
    note.title = "";
    note.content = "";
    const created = await this.noteRepo.save(note);
    return created;
  }

  async update(
    id: string,
    updates: DeepPartial<Note>
  ): Promise<Note> {
    const { title, content, tags } = updates;
    const tagNames = tags?.map((tag) => tag.name) || [];
    const existingTags = await this.tagRepo.find({
      where: {
        name: In(tagNames),
      },
    });

    const newTags = tagNames
      .filter(
        (name) => !existingTags.find((tag) => tag.name === name)
      )
      .map((name) => this.tagRepo.create({ name }));

    await this.tagRepo.save(newTags);
    const allTags = [...existingTags, ...newTags];

    const note = this.noteRepo.save({
      id,
      title,
      content,
      tags: allTags,
    });
    return note;
  }
}
