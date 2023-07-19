import { Knex } from "knex";

const db: Knex = require("knex")({
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

const fetchNotes = async () => {
  return await db("note").select("*");
};

import { Note } from "knex/types/tables";
const createNote = async (note: Note) => {
  const res = await db("note").insert(note);
  return res;
};

export default {
  fetchNotes,
  createNote,
};
