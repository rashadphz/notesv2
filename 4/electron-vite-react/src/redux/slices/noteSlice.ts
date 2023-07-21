import {
  createAsyncThunk,
  createSlice,
  createEntityAdapter,
  EntityState,
  PayloadAction,
} from "@reduxjs/toolkit";
import { debounce } from "lodash";
import { RootState } from "../store";
import { Note } from "knex/types/tables";

export const fetchNotes = createAsyncThunk<Note[], void>(
  "notes/fetchNotes",
  async (_, { getState }) => {
    return await api.fetchNotes();
  }
);

export const createNoteAsync = createAsyncThunk<Note, void>(
  "notes/createNote",
  async (_, { getState }) => {
    return await api.createNote();
  }
);

export const saveNoteAsync = createAsyncThunk<Note, Note>(
  "notes/saveNote",
  async (note, { getState }) => {
    const { id, ...updates } = note;
    return (await api.saveNote(id, updates)) || note;
  }
);

// export const saveNoteAsyncDebounce: (note: Note) => void = debounce(
//   (note: Note) => saveNoteAsync(note),
//   1000
// );

const NotesAdapter = createEntityAdapter<Note>({
  selectId: (note) => note.id,
  sortComparer: (a, b) => {
    if (b.updated === undefined) return -1;
    if (a.updated === undefined) return 1;
    return b.updated - a.updated;
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
      state.selectedNote = action.payload[0] || null;
    });
    builder.addCase(createNoteAsync.fulfilled, (state, action) => {
      NotesAdapter.addOne(state.all, action.payload);
      state.selectedNote = action.payload;
      state.canCreateNewNote = false;
    });
    builder.addCase(saveNoteAsync.fulfilled, (state, action) => {
      NotesAdapter.upsertOne(state.all, action.payload);
    });
  },
});

export const { selectNote } = noteSlice.actions;
export const noteSelectors = NotesAdapter.getSelectors<RootState>(
  (state) => state.notes.all
);

export default noteSlice.reducer;
