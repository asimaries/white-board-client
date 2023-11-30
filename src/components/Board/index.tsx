"use client";
import { useEffect, useLayoutEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { MENU_ITEMS } from "@/constants";
import { RootState } from "@/store";
import { actionItemClick, updateDisableButton } from "@/store/slice/MenuSlice";
import Stack from "@/utils/stack";

import { socket } from "@/socket";

export default function Board() {
  const undoStackRef = useRef(new Stack<ImageData>());
  const redoStackRef = useRef(new Stack<ImageData>());

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shouldDraw = useRef(false);

  const dispatch = useDispatch();
  const { activeMenuItem, actionMenuItem } = useSelector(
    (state: RootState) => state.menu
  );
  const { color, size } = useSelector(
    (state: RootState) => state.toolbox[activeMenuItem]
  ) as { color: string; size: number };

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (actionMenuItem === MENU_ITEMS.DOWNLOAD) {
      const URL = canvas.toDataURL();
      const anchor = document.createElement("a");
      anchor.href = URL;
      anchor.download = "sketch.jpg";
      anchor.click();
    } else if (actionMenuItem === MENU_ITEMS.UNDO) {
      if (undoStackRef.current.isEmpty()) {
        console.warn("No element left");
        return;
      }
      redoStackRef.current.push(undoStackRef.current.top());
      undoStackRef.current.pop();
      if (undoStackRef.current.isEmpty()) {
        context?.putImageData(
          context!.createImageData(canvas.width, canvas.height),
          0,
          0
        );
      } else {
        context?.putImageData(undoStackRef.current.top(), 0, 0);
      }
    } else if (actionMenuItem === MENU_ITEMS.REDO) {
      if (redoStackRef.current.isEmpty()) {
        console.warn("No element left");
        return;
      }
      undoStackRef.current.push(redoStackRef.current.top());
      context?.putImageData(redoStackRef.current.top(), 0, 0);
      redoStackRef.current.pop();
    }
    dispatch(
      updateDisableButton([
        undoStackRef.current.isEmpty(),
        redoStackRef.current.isEmpty(),
      ])
    );
    return () => {
      dispatch(actionItemClick(null));
    };
  }, [actionMenuItem]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;
    const changeConfig = ({ color, size }: { color: string; size: number }) => {
      context.strokeStyle = color ?? "black";
      context.lineWidth = size ?? 3;
    };
    changeConfig({ color, size });
    socket.emit("changeConfig", { color, size });

    socket.on("changeConfig", changeConfig);
    return () => {
      socket.off("changeConfig", changeConfig);
    };
  }, [color, size]);

  useLayoutEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    dispatch(
      updateDisableButton([
        undoStackRef.current.isEmpty(),
        redoStackRef.current.isEmpty(),
      ])
    );

    const beginPath = (x: number, y: number) => {
      context?.beginPath();
      context?.moveTo(x, y);
    };

    const drawPath = (x: number, y: number) => {
      context?.lineTo(x, y);
      context?.stroke();
    };

    const handleMouseDown = (
      e: globalThis.MouseEvent | globalThis.TouchEvent
    ) => {
      shouldDraw.current = true;

      const clientX =
        e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
      const clientY =
        e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
      // console.log(clientX, clientY);

      beginPath(clientX, clientY);
      socket.emit("beginPath", { x: clientX, y: clientY });
    };

    const handleMouseMove = (
      e: globalThis.MouseEvent | globalThis.TouchEvent
    ) => {
      const clientX =
        e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
      const clientY =
        e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;

      if (!shouldDraw.current) return;
      drawPath(clientX, clientY);
      // console.log(clientX, clientY);
      socket.emit("drawPath", { x: clientX, y: clientY });
    };

    const handleMouseUp = (
      e: globalThis.MouseEvent | globalThis.TouchEvent
    ) => {
      shouldDraw.current = false;
      const imageData = context!.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      );
      undoStackRef.current.push(imageData);
      redoStackRef.current.clear();
      dispatch(
        updateDisableButton([
          undoStackRef.current.isEmpty(),
          redoStackRef.current.isEmpty(),
        ])
      );
    };
    const handleBeginPath = (path: { x: number; y: number }) => {
      beginPath(path.x, path.y);
    };

    const handleDrawPath = (path: { x: number; y: number }) => {
      drawPath(path.x, path.y);
    };
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    canvas.addEventListener("touchstart", handleMouseDown);
    canvas.addEventListener("touchmove", handleMouseMove);
    canvas.addEventListener("touchend", handleMouseUp);
    // socket.on("connection", () => {
    //   console.log("connected");
    // });
    socket.on("beginPath", handleBeginPath);
    socket.on("drawPath", handleDrawPath);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);

      canvas.removeEventListener("touchstart", handleMouseDown);
      canvas.removeEventListener("touchmove", handleMouseMove);
      canvas.removeEventListener("touchend", handleMouseUp);

      socket.off("beginPath", handleBeginPath);
      socket.off("drawLine", handleDrawPath);
    };
  }, []);
  return <canvas ref={canvasRef}></canvas>;
}
