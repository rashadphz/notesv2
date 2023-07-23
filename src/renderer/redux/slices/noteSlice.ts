import {
  createAsyncThunk,
  createSlice,
  createEntityAdapter,
  EntityState,
  PayloadAction,
} from "@reduxjs/toolkit";
import { debounce } from "lodash";
import { RootState } from "../store";

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export const fetchNotes = createAsyncThunk<Note[], void>(
  "notes/fetchNotes",
  async (_, { getState }) => {
    const baseNote = {
      createdAt: 123,
      updatedAt: 123,
    };
    return [
      {
        ...baseNote,
        content: "### nice widgets for them",
        title: "indexing youtube videos for",
        id: 1,
      },
      {
        ...baseNote,
        content: "mochi dounts",
        title: "seattle",
        id: 2,
      },
      {
        ...baseNote,
        content: "i have a table payment",
        title: "ask RDI",
        id: 3,
      },
    ];
  }
);

const NotesAdapter = createEntityAdapter<Note>({
  selectId: (note) => note.id,
  sortComparer: (a, b) => b.updatedAt - a.updatedAt,
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
    addNote: (state, action: PayloadAction<Note>) => {
      NotesAdapter.addOne(state.all, action.payload);
    },
    createNote: (state) => {
      if (!state.canCreateNewNote) return;

      const newNote = {
        id: Date.now().toString(),
        title: "",
        content: "",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      NotesAdapter.addOne(state.all, newNote);
      state.selectedNote = newNote;
      state.canCreateNewNote = false;
    },
    selectNote: (state, action: PayloadAction<{ id: string }>) => {
      state.selectedNote =
        state.all.entities[action.payload.id] || null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNotes.fulfilled, (state, action) => {
      NotesAdapter.setAll(state.all, action.payload);
      state.selectedNote = action.payload[0] || null;
    });
  },
});

export const { selectNote, createNote } = noteSlice.actions;
export const noteSelectors = NotesAdapter.getSelectors<RootState>(
  (state) => state.notes.all
);

export default noteSlice.reducer;
