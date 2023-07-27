import { Container } from "inversify";
import { INJECTIONS } from "./injections";
import DatabaseService from "./service/DatabaseService";
import DatabaseServiceImpl from "./service/DatabaseService";
import NoteServiceImpl, { NoteService } from "./service/NoteService";

export const container = new Container({
  skipBaseClassChecks: true,
  defaultScope: "Singleton",
  autoBindInjectable: true,
});
container
  .bind<DatabaseService>(INJECTIONS.DatabaseService)
  .to(DatabaseServiceImpl);

container
  .bind<NoteService>(INJECTIONS.NoteService)
  .to(NoteServiceImpl);
