import React, { useState } from "react";
import StartMenu from "./StartMenu";
import startIcon from "../assets/icons/desktop.png";
import "../styles/taskBar.css";

interface TaskbarProps {
  windows: { title: string; minimized: boolean }[];
  onRestore: (title: string) => void;
  onOpenWindow: (props: {
    title: string;
    content: React.ReactNode;
    minimized: boolean;
    width?: number;
    height?: number;
  }) => void;
}

const Taskbar: React.FC<TaskbarProps> = ({ windows, onRestore, onOpenWindow }) => {
  const [time] = useState(() => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  });

  const [startMenuVisible, setStartMenuVisible] = useState(false);

  return (
    <div className="taskbar">
      <button
        className={`taskbar-start-button ${startMenuVisible ? "active" : ""}`}
        onClick={() => setStartMenuVisible(!startMenuVisible)}
      >
        <img src={startIcon} className="start-menu-icon" />
        Démarrer
      </button>

      {startMenuVisible && (
        <StartMenu
          onOpenWindow={onOpenWindow}
          onCloseMenu={() => setStartMenuVisible(false)}
        />
      )}


      <div className="taskbar-separator" />

      <div className="taskbar-windows">
        {windows.map((win, _) => (
          <button
            key={win.title}
            className={`taskbar-window-button ${!win.minimized ? "active" : ""}`}
            onClick={() => onRestore(win.title)}
          >
            {win.title}
          </button>
        ))}
      </div>

      <div className="taskbar-clock">
        <span>{time.split(":")[0]}</span>
        <span className="blinking-colon">:</span>
        <span>{time.split(":")[1]}</span>
      </div>
    </div>
  );
};

export default Taskbar;