import { Rnd } from "react-rnd";
import { X } from "lucide-react";
import "../styles/retroWindow.css";

interface RetroWindowProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onMinimize: () => void;
  onClick: () => void;
  zIndex: number;
  x: number;
  y: number;
  width?: number;
  height?: number;
  onMove: (x: number, y: number) => void;
}

export function RetroWindow({
  title,
  children,
  onMove,
  onClose,
  onMinimize,
  onClick,
  zIndex,
  x,
  y,
  width,
  height,
}: RetroWindowProps) {
  return (
    <Rnd
    position={{ x, y }}
    size={{ width: width || 400, height: height || 300 }}
    onDragStop={(_, d) => onMove(d.x, d.y)}
      bounds="parent"
      style={{
        position: "absolute",
        zIndex,
      }}
      className="retro-window"
    >
      <div className="window-frame" onMouseDown={onClick}>
        <div className="window-title-bar">
          <span className="window-title">{title}</span>
          <div className="window-buttons">
            <button className="window-minimize-button" onClick={onMinimize}>
              &minus;
            </button>
            <button className="window-close-button" onClick={onClose}>
              <X size={14} />
            </button>
          </div>
        </div>
        <div className="window-content">{children}</div>
      </div>
    </Rnd>
  );
}