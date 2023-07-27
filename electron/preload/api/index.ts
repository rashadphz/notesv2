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
  allNotes: async () => await noteServ.findAll(),
  createNote: async () => await noteServ.create(),
  updateNote: async (id: string, updates: Partial<Note>) =>
    noteServ.update(id, updates),
};

export default { API };
