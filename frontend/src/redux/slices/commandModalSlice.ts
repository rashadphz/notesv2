import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CommandModalState {
  open: boolean;
}

const initialState: CommandModalState = {
  open: false,
};

export const commandModalSlice = createSlice({
  name: "commandModal",
  initialState,
  reducers: {
    handleOpen: (state) => {
      state.open = true;
    },
    handleClose: (state) => {
      state.open = false;
    },
  },
});

export const { handleOpen, handleClose } = commandModalSlice.actions;

export default commandModalSlice.reducer;
