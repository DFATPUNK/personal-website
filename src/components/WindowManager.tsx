import { PropsWithChildren, createContext, useContext, useState } from "react";
import { RetroWindow } from "./RetroWindow";
import Taskbar from "./Taskbar";

interface WindowProps {
  title: string;
  content: React.ReactNode;
  minimized: boolean;
  x: number;
  y: number;
  width?: number;
  height?: number;
}

interface WindowManagerContextProps {
  openWindow: (window: Omit<WindowProps, "x" | "y">) => void;
  minimizeWindow: (title: string) => void;
  toggleWindow: (title: string) => void;
  moveWindow: (title: string, x: number, y: number) => void;
}

const WindowManagerContext = createContext<WindowManagerContextProps | null>(
  null
);

export const useWindowManager = () => {
  const context = useContext(WindowManagerContext);
  if (!context) {
    throw new Error("useWindowManager must be used within a WindowManager");
  }
  return context;
};

export default function WindowManager({ children }: PropsWithChildren) {
  const [openWindows, setOpenWindows] = useState<WindowProps[]>([]);
  const [zIndexes, setZIndexes] = useState<number[]>([]);
  const [highestZIndex, setHighestZIndex] = useState(100);

  const openWindow = (newWindow: Omit<WindowProps, "x" | "y">) => {
    const existingIndex = openWindows.findIndex((w) => w.title === newWindow.title);

    if (existingIndex !== -1) {
      bringToFront(newWindow.title);
      const updatedWindows = [...openWindows];
      updatedWindows[existingIndex].minimized = false;
      setOpenWindows(updatedWindows);
      return;
    }

    const offset = openWindows.length * 20;
    const defaultX = 100 + offset;
    const defaultY = 100 + offset;

    setOpenWindows([
      ...openWindows,
      {
        ...newWindow,
        minimized: false,
        x: defaultX,
        y: defaultY,
        width: newWindow.width,
        height: newWindow.height,
      },
    ]);
    setZIndexes([...zIndexes, highestZIndex + 1]);
    setHighestZIndex(highestZIndex + 1);
  };

  const minimizeWindow = (title: string) => {
    const index = openWindows.findIndex((w) => w.title === title);
    if (index === -1) return;
    const updatedWindows = [...openWindows];
    updatedWindows[index].minimized = true;
    setOpenWindows(updatedWindows);
  };

  const toggleWindow = (title: string) => {
    const index = openWindows.findIndex((w) => w.title === title);
    if (index === -1) return;

    const updated = [...openWindows];
    const updatedZIndexes = [...zIndexes];

    if (updated[index].minimized) {
      const newZ = highestZIndex + 1;
      updated[index].minimized = false;
      updatedZIndexes[index] = newZ;
      setHighestZIndex(newZ);
    } else {
      updated[index].minimized = true;
    }

    setOpenWindows(updated);
    setZIndexes(updatedZIndexes);
  };

  const moveWindow = (title: string, x: number, y: number) => {
    const index = openWindows.findIndex((w) => w.title === title);
    if (index === -1) return;
    const updated = [...openWindows];
    updated[index].x = x;
    updated[index].y = y;
    setOpenWindows(updated);
  };

  const bringToFront = (title: string) => {
    const index = openWindows.findIndex((w) => w.title === title);
    if (index === -1) return;
    const newZ = highestZIndex + 1;
    const updatedZIndexes = [...zIndexes];
    updatedZIndexes[index] = newZ;
    setZIndexes(updatedZIndexes);
    setHighestZIndex(newZ);
  };

  const closeWindow = (index: number) => {
    const updatedWindows = [...openWindows];
    const updatedZ = [...zIndexes];
    updatedWindows.splice(index, 1);
    updatedZ.splice(index, 1);
    setOpenWindows(updatedWindows);
    setZIndexes(updatedZ);
  };

  return (
    <WindowManagerContext.Provider value={{ openWindow, minimizeWindow, toggleWindow, moveWindow }}>
      {children}
      {openWindows.map((win, index) =>
        win.minimized ? null : (
          <RetroWindow
            key={win.title}
            title={win.title}
            zIndex={zIndexes[index]}
            x={win.x}
            y={win.y}
            width={win.width}
            height={win.height}
            onMinimize={() => minimizeWindow(win.title)}
            onClose={() => closeWindow(index)}
            onClick={() => bringToFront(win.title)}
            onMove={(x, y) => moveWindow(win.title, x, y)}
          >
            {win.content}
          </RetroWindow>
        )
      )}
      <Taskbar
        windows={openWindows}
        zIndexes={zIndexes}
        onRestore={toggleWindow}
      />
    </WindowManagerContext.Provider>
  );
}