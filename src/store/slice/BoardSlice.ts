import { createSlice } from "@reduxjs/toolkit";
import { MENU_ITEMS, COLORS } from "@/constants";
type IinitialState = {
  history: number;
  drawHistory: ImageData[];
};
const initialState: IinitialState = {
  history: -1,
  drawHistory: [],
};

export const BoardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    historyUndo: (state, action) => {
      state.history = state.history - 1;
    },
    historyRedo: (state, action) => {
      state.history = state.history + 1;
    },
    addDrawHistory: (
      state,
      action: { payload: { canvasImage: ImageData } }
    ) => {
      state.drawHistory = state.drawHistory.slice(0, state.history);
      // const { data, ...asas } = action.payload.canvasImage;

      state.drawHistory.push(
        JSON.parse(JSON.stringify(action.payload.canvasImage))
      );
      state.history = state.history + 1;
    },
  },
});

export const { historyUndo, historyRedo, addDrawHistory } = BoardSlice.actions;

export default BoardSlice.reducer;
