import { createSlice } from "@reduxjs/toolkit";
const undoSlice = createSlice({
  name: "undo",
  initialState: null,
  reducers: {
    rememberDeleted: (_state, action) => action.payload,
    clearUndo: () => null,
  },
});
export const { rememberDeleted, clearUndo } = undoSlice.actions;
export default undoSlice.reducer;
