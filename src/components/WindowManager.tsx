import React, { createContext, useContext, useState } from "react";
import RetroWindow from "./RetroWindow";
import Taskbar from "./Taskbar";

interface WindowProps {
  title: string;
  content: React.ReactNode;
  minimized: boolean;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
}

interface WindowManagerContextProps {
  openWindow: (props: WindowProps) => void;
}

const WindowManagerContext = createContext<WindowManagerContextProps | null>(null);

export const useWindowManager = () => {
  const context = useContext(WindowManagerContext);
  if (!context) throw new Error("useWindowManager must be used within WindowManager");
  return context;
};

let zIndexCounter = 1;

const WindowManager: React.FC<{
  children: React.ReactNode;
  isMobile: boolean;
  setIsMobile: (val: boolean) => void;
}> = ({ children, isMobile, setIsMobile }) => {
  const [windows, setWindows] = useState<(WindowProps & {
    zIndex: number;
  })[]>([]);

  const bringToFront = (title: string) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.title === title ? { ...w, zIndex: ++zIndexCounter } : w
      )
    );
  };

  const openWindow = ({ title, content, minimized, width = 400, height = 325, x = 200, y = 100 }: WindowProps) => {
    setWindows((prev) => {
      const existing = prev.find((w) => w.title === title);
      if (existing) {
        return prev.map((w) =>
          w.title === title
            ? { ...w, minimized: false, zIndex: ++zIndexCounter }
            : w
        );
      }
      const offset = prev.length * 20;
      return [
        ...prev,
        { title, content, minimized, width, height, x: x + offset, y: y + offset, zIndex: ++zIndexCounter },
      ];
    });
  };

  const closeWindow = (title: string) => {
    setWindows((prev) => prev.filter((w) => w.title !== title));
  };

  const minimizeWindow = (title: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.title === title ? { ...w, minimized: true } : w))
    );
  };

  const toggleWindow = (title: string) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.title === title ? { ...w, minimized: !w.minimized, zIndex: ++zIndexCounter } : w
      )
    );
  };

  const moveWindow = (title: string, x: number, y: number) => {
    setWindows((prev) =>
      prev.map((w) => (w.title === title ? { ...w, x, y } : w))
    );
  };

  const resizeWindow = (title: string, width: number, height: number) => {
    if (title === "Bienvenue") return;
  
    setWindows((prev) =>
      prev.map((w) =>
        w.title === title ? { ...w, width, height } : w
      )
    );
  };  

  return (
    <WindowManagerContext.Provider value={{ openWindow }}>
      {children}
      {windows.map(
  ({ title, content, minimized, width, height, x = 100, y = 100, zIndex }) =>
    !minimized && (
      <RetroWindow
  key={title}
  title={title}
  zIndex={zIndex}
  x={x}
  y={y}
  width={width}
  height={height}
  onMinimize={() => minimizeWindow(title)}
  onClose={() => closeWindow(title)}
  onClick={() => bringToFront(title)}
  onMove={(x, y) => moveWindow(title, x, y)}
  onResize={(w, h) => resizeWindow(title, w, h)}
  resizable={title !== "Bienvenue"}
  customActions={
    title === "CV" ? (
      <a
        href="../public/certificates/CV Jérémy Brunet Mars 2025.pdf"
        download
        title="Télécharger le CV"
      >
        <button className="window-download-button">💾</button>
      </a>
    ) : null
  }
>
  {content}
</RetroWindow>

    )
      )}
      <Taskbar
        windows={windows.map(({ title, minimized }) => ({ title, minimized }))}
        onRestore={toggleWindow}
        onOpenWindow={openWindow}
        isMobile={isMobile}
        setIsMobile={setIsMobile}
      />
    </WindowManagerContext.Provider>
  );
};

export default WindowManager;