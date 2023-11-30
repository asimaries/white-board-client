import { createSlice } from "@reduxjs/toolkit";
import { MENU_ITEMS } from "@/constants";
const initialState = {
  activeMenuItem: MENU_ITEMS.PENCIL,
  actionMenuItem: null,
  disableButton: [false, false],
};

export const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    menuItemClick: (state, action) => {
      state.activeMenuItem = action.payload;
    },
    actionItemClick: (state, action) => {
      state.actionMenuItem = action.payload;
    },
    updateDisableButton: (state, action: { payload: boolean[] }) => {
      state.disableButton = action.payload;
    },
  },
});

export const { menuItemClick, actionItemClick, updateDisableButton } =
  menuSlice.actions;
export default menuSlice.reducer;
