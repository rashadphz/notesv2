import { configureStore } from "@reduxjs/toolkit";
import { noteSlice } from "./slices/noteSlice";

export const store = configureStore({
  reducer: {
    [noteSlice.name]: noteSlice.reducer,
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
