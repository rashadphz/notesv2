import { configureStore } from "@reduxjs/toolkit";
import { noteSlice } from "./slices/noteSlice";
import { commandModalSlice } from "./slices/commandModalSlice";

export const store = configureStore({
  reducer: {
    [noteSlice.name]: noteSlice.reducer,
    [commandModalSlice.name]: commandModalSlice.reducer,
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
