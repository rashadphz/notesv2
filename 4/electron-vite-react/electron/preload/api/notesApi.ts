import { Knex } from "knex";
import { v4 as uuidv4 } from "uuid";

import { Note } from "knex/types/tables";
import { db } from ".";

export interface NotesApi {
  fetchNotes: () => Promise<Note[]>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<Note>;
  createNote: () => Promise<Note>;
  getNote: (id: string) => Promise<Note | null>;
  deleteNote: (id: string) => Promise<boolean>;
  saveNote: (
    id: string,
    updates: Partial<Note>
  ) => Promise<Note | null>;
}

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

export const NotesApi: NotesApi = {
  fetchNotes,
  updateNote,
  createNote,
  getNote,
  deleteNote,
  saveNote,
};
