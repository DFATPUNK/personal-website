import { PropsWithChildren, createContext, useContext, useState } from "react";
import { RetroWindow } from "./RetroWindow";
import Taskbar from "./Taskbar";

interface WindowProps {
  title: string;
  content: React.ReactNode;
}

interface WindowManagerContextProps {
  openWindow: (window: WindowProps) => void;
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

  const openWindow = (newWindow: WindowProps) => {
    const existingIndex = openWindows.findIndex(
      (w) => w.title === newWindow.title
    );

    if (existingIndex !== -1) {
      const newZ = highestZIndex + 1;
      const updatedZIndexes = [...zIndexes];
      updatedZIndexes[existingIndex] = newZ;
      setZIndexes(updatedZIndexes);
      setHighestZIndex(newZ);
      return;
    }

    setOpenWindows([...openWindows, newWindow]);
    setZIndexes([...zIndexes, highestZIndex + 1]);
    setHighestZIndex(highestZIndex + 1);
  };

  const minimizeWindow = (index: number) => {
    const updatedZ = [...zIndexes];
    updatedZ[index] = -1;
    setZIndexes(updatedZ);
  };

  const restoreWindow = (index: number) => {
    const newZ = highestZIndex + 1;
    const updatedZ = [...zIndexes];
    updatedZ[index] = newZ;
    setZIndexes(updatedZ);
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
    <WindowManagerContext.Provider value={{ openWindow }}>
      {children}
      {openWindows.map((win, index) => (
        <RetroWindow
          key={win.title}
          title={win.title}
          zIndex={zIndexes[index]}
          onMinimize={() => minimizeWindow(index)}
          onClose={() => closeWindow(index)}
          onClick={() => restoreWindow(index)}
        >
          {win.content}
        </RetroWindow>
      ))}
      <Taskbar
        windows={openWindows}
        zIndexes={zIndexes}
        onRestore={restoreWindow}
      />
    </WindowManagerContext.Provider>
  );
}