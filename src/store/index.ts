import { configureStore } from "@reduxjs/toolkit";
import MenuReducer from "@/store/slice/MenuSlice";
import ToolbarReducer from "@/store/slice/ToolboxSlice";
import BoardReducer from "@/store/slice/BoardSlice";

export const store = configureStore({
  reducer: {
    menu: MenuReducer,
    toolbox: ToolbarReducer,
    board: BoardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["board/addDrawHistory"],
        // Ignore these field paths in all actions
        ignoredActionPaths: ["meta.arg", "payload.canvasImage"],
        // Ignore these paths in the state
        ignoredPaths: ["items.drawHistory"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
