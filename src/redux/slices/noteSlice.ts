import {
  createAsyncThunk,
  createSlice,
  createEntityAdapter,
  EntityState,
  PayloadAction,
} from "@reduxjs/toolkit";
import { debounce } from "lodash";
import { RootState } from "../store";
import { Note } from "electron/preload/api/typeorm/entity/Note";

export const API = api.API;

const titleFromContent = (content: string) => {
  const firstLine = content.split("\n")[0];
  const markdownRemoved = firstLine.replace(/[#*]/g, "");

  return markdownRemoved.trim();
};

const tagsFromContent = (content: string) => {
  const tagRegex = /#(\w+)/g;
  const matches = content.matchAll(tagRegex);
  const tags = Array.from(matches, (match) => match[1]);
  return tags;
};

export const fetchNotes = createAsyncThunk<Note[], void>(
  "notes/fetchNotes",
  async (_, { getState }) => {
    return await API.allNotes();
  }
);

export const createNoteAsync = createAsyncThunk<Note, void>(
  "notes/createNote",
  async (_, { getState }) => {
    return await API.createNote();
  }
);

export const deleteNoteAsync = createAsyncThunk<string, string>(
  "notes/deleteNote",
  async (id, { getState }) => {
    return id;
  }
);

export const saveNoteAsync = createAsyncThunk<Note, Note>(
  "notes/saveNote",
  async (note, { getState }) => {
    const { id, title, ...updates } = note;

    const parsedTitle = titleFromContent(note.content);
    const parsedTags = tagsFromContent(note.content).map((name) => {
      return { name };
    });

    return await API.updateNote(id, {
      title: parsedTitle,
      ...updates,
      tags: parsedTags,
    });
  }
);

const NotesAdapter = createEntityAdapter<Note>({
  selectId: (note) => note.id,
  sortComparer: (a, b) => {
    return b.updatedAt - a.updatedAt;
  },
});

interface NoteState {
  all: EntityState<Note>;
  selectedNote: Note | null;
  canCreateNewNote: boolean;
}

const initialState: NoteState = {
  all: NotesAdapter.getInitialState(),
  selectedNote: null,
  canCreateNewNote: true,
};

export const noteSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    selectNote: (state, action: PayloadAction<{ id: string }>) => {
      state.selectedNote =
        state.all.entities[action.payload.id] || null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNotes.fulfilled, (state, action) => {
      NotesAdapter.setAll(state.all, action.payload);
      state.selectedNote =
        state.all.entities[state.all.ids[0]] || null;
    });
    builder.addCase(createNoteAsync.fulfilled, (state, action) => {
      NotesAdapter.addOne(state.all, action.payload);
      state.selectedNote = action.payload;
      state.canCreateNewNote = false;
    });
    builder.addCase(saveNoteAsync.fulfilled, (state, action) => {
      NotesAdapter.upsertOne(state.all, action.payload);
    });
    builder.addCase(deleteNoteAsync.fulfilled, (state, action) => {
      const deletedNoteId = action.payload;
      const deletedNoteIndex = state.all.ids.indexOf(deletedNoteId);
      if (deletedNoteIndex !== -1) {
        NotesAdapter.removeOne(state.all, deletedNoteId);
        const nextNoteId = state.all.ids[deletedNoteIndex] || null;
        state.selectedNote = nextNoteId
          ? state.all.entities[nextNoteId] || null
          : null;
      }
    });
  },
});

export const { selectNote } = noteSlice.actions;
export const noteSelectors = NotesAdapter.getSelectors<RootState>(
  (state) => state.notes.all
);

export default noteSlice.reducer;
