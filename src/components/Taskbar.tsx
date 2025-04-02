import "../styles/taskBar.css";

interface TaskbarProps {
  windows: { title: string; minimized: boolean }[];
  zIndexes: number[];
  onRestore: (title: string) => void;
}

export default function Taskbar({ windows, onRestore }: TaskbarProps) {
  return (
    <footer className="taskbar">
      <button className="taskbar-start-button">Démarrer</button>
      <div className="taskbar-separator" />
      <div className="taskbar-windows">
        {windows.map((win) => (
          <button
            key={win.title}
            className={`taskbar-window-button ${win.minimized ? "" : "active"}`}
            onClick={() => onRestore(win.title)}
          >
            {win.title}
          </button>
        ))}
      </div>
      <div className="taskbar-clock">12:00</div>
    </footer>
  );
}