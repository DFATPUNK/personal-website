import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import "../styles/retroWindow.css";

interface RetroWindowProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onMinimize: () => void;
  onClick: () => void;
  onMove?: (x: number, y: number) => void;
  onResize?: (width: number, height: number) => void;
  resizable?: boolean;
  zIndex: number;
  x: number;
  y: number;
  width?: number;
  height?: number;
  customActions?: React.ReactNode;
}

export function RetroWindow({
  title,
  children,
  onClose,
  onMinimize,
  onClick,
  onMove,
  onResize,
  resizable,
  zIndex,
  x,
  y,
  width = 400,
  height = 300,
  customActions
}: RetroWindowProps) {
  const [size, setSize] = useState({ width, height });
  const [position, setPosition] = useState({ x, y });

  useEffect(() => {
    setSize({ width, height });
  }, [width, height]);

  useEffect(() => {
    setPosition({ x, y });
  }, [x, y]);

  return (
    <Rnd
      size={size}
      position={position}
      enableResizing={resizable !== false}
      onResizeStop={(_, __, ref, ___, newPosition) => {
        const newSize = { width: ref.offsetWidth, height: ref.offsetHeight };
        setSize(newSize);
        setPosition(newPosition);
        if (onResize) onResize(newSize.width, newSize.height);
      }}
      onDragStop={(_, d) => {
        const newPos = { x: d.x, y: d.y };
        setPosition(newPos);
        if (onMove) onMove(newPos.x, newPos.y);
      }}
      bounds="parent"
      style={{ position: "absolute", zIndex }}
      className="retro-window"
      onMouseDown={onClick}
    >
      <div className="window-frame">
        <div className="window-title-bar" onMouseDown={onClick}>
          <span className="window-title">{title}</span>
          <div className="window-buttons">
            {customActions}
            <button className="window-minimize-button" onClick={onMinimize}>
              &minus;
            </button>
            <button className="window-close-button" onClick={onClose}>
              ✕
            </button>
          </div>
        </div>
        <div className="window-content">{children}</div>
      </div>
    </Rnd>
  );
}

export default RetroWindow;
