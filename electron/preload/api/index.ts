import { Knex } from "knex";
import { v4 as uuidv4 } from "uuid";
import { NotesApi } from "./notesApi";

export const db: Knex = require("knex")({
  client: "sqlite3", // todo: change to better-sqlite3
  connection: {
    filename: "./mydb.sqlite",
  },
  useNullAsDefault: true,
});

declare module "knex/types/tables" {
  export interface Note {
    id: string;
    title: string;
    content: string;
    created?: number;
    updated?: number;
  }
  export interface Tag {
    id: string;
    name: string;
    created?: number;
    updated?: number;
  }

  export interface Tables {
    note: Note;
  }
}
console.log("creating the tables...");

console.log("creating notes table...");
db.schema.hasTable("note").then((exists) => {
  console.log("notes table exists?", exists);
  if (!exists) {
    return db.schema
      .createTable("note", (table) => {
        table.string("id").primary().unique().notNullable();
        table.string("title");
        table.string("content");
        table.integer("created").notNullable().defaultTo(Date.now());
        table.integer("updated").notNullable().defaultTo(Date.now());
      })
      .then(() => {
        console.log("created table note");
      })
      .catch((err) => {
        console.log("error creating table note", err);
      });
  }
});

import { Note } from "knex/types/tables";

const fetchNotes = async () => {
  return await db("note").select("*");
};

const updateNote = async (
  id: string,
  updates: Partial<Note>
): Promise<Note> => {
  return await db("note")
    .where("id", id)
    .update({
      ...updates,
      updated: Date.now(),
    });
};

const deleteNote = async (id: string): Promise<boolean> => {
  return await db("note").where("id", id).del();
};

const createNote = async (): Promise<Note> => {
  const note: Note = {
    id: uuidv4(),
    title: "",
    content: "",
    created: Date.now(),
    updated: Date.now(),
  };

  await db("note").insert(note);
  return note;
};

const saveNote = async (
  id: string,
  updates: Partial<Note>
): Promise<Note | null> => {
  const note = await getNote(id);
  if (!note) return null;

  const updatedNote = {
    ...note,
    ...updates,
    updated: Date.now(),
  };

  await db("note").where("id", id).update(updatedNote);
  return updatedNote;
};

const getNote = async (id: string): Promise<Note | null> => {
  const notes: Note[] = await db("note").where("id", id);
  return notes.length ? notes[0] : null;
};

export default { NotesApi };
