import { DeepPartial } from "typeorm";
import { INJECTIONS } from "./injections";
import { container } from "./inversify.config";
import { NoteService } from "./service/NoteService";
import { Note } from "./typeorm/entity/Note";

// const DatabaseService = container.get<DatabaseService>(
//   INJECTIONS.DatabaseService
// );

// console.log("DatabaseService", DatabaseService);
// DatabaseService.initialize();

const noteServ = container.get<NoteService>(INJECTIONS.NoteService);

const API = {
  allNotes: async () => noteServ.findAll(),
  createNote: async () => noteServ.create(),
  updateNote: async (id: string, updates: DeepPartial<Note>) =>
    noteServ.update(id, updates),
  searchNotes: async (query: string) => noteServ.searchNotes(query),
  searchTags: async (query: string) => noteServ.searchTags(query),
  indexNote: async (id: string) => noteServ.indexNote(id),
  smartSearch: async (query: string) => noteServ.smartSearch(query),
};

export default { API };
