import React from "react";
import { Rnd } from "react-rnd";
import { X } from "lucide-react";
import "./retroWindow.css";

interface RetroWindowProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  zIndex: number;
  defaultPosition?: { x: number; y: number };
  onMinimize?: () => void;
  onClick?: () => void;
}

export const RetroWindow: React.FC<RetroWindowProps> = ({
  title,
  children,
  onClose,
  onMinimize,
  onClick, // ✅ Ajout ici
  zIndex,
  defaultPosition = { x: 100, y: 100 },
}) => {
  return (
    <Rnd
      default={{ x: defaultPosition.x, y: defaultPosition.y, width: 400, height: 300 }}
      bounds="parent"
      style={{ zIndex }}
      className="retro-window"
    >
      <div className="window-frame" onMouseDown={onClick}>
        <div className="window-title-bar">
          <span className="window-title">{title}</span>
          <button className="window-close-button" onClick={onClose}>
            <X size={14} />
          </button>
        </div>
        <div className="window-content">{children}</div>
      </div>
    </Rnd>
  );
};