"use client";
import Board from "@/components/Board";
import Menu from "@/components/Menu";
import ToolBox from "@/components/ToolBox";

import { Provider } from "react-redux";
import { store } from "@/store";

export default function Home() {
  return (
    <Provider store={store}>
      <main className="min-h-screen">
        <Menu />
        <ToolBox />
        <Board />
      </main>
    </Provider>
  );
}
