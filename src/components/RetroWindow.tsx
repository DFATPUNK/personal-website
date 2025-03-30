import { useEffect, useRef } from "react";

export interface RetroWindowProps {
  title: string;
  contentUrl: string;
  zIndex: number;
  onMinimize: () => void;
  onClose: () => void;
  onClick: () => void;
}

export default function RetroWindow({
  title,
  contentUrl,
  zIndex,
  onMinimize,
  onClose,
  onClick,
}: RetroWindowProps) {
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = windowRef.current;
    let offsetX = 0;
    let offsetY = 0;
    let isDragging = false;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      const rect = el?.getBoundingClientRect();
      offsetX = e.clientX - (rect?.left ?? 0);
      offsetY = e.clientY - (rect?.top ?? 0);
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isDragging && el) {
        el.style.left = `${e.clientX - offsetX}px`;
        el.style.top = `${e.clientY - offsetY}px`;
      }
    };

    const onMouseUp = () => {
      isDragging = false;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    const header = el?.querySelector(".window-header");
    header?.addEventListener("mousedown", onMouseDown as EventListener);

    return () => {
      header?.removeEventListener("mousedown", onMouseDown as EventListener);
    };
  }, []);

  return (
    <div
      ref={windowRef}
      className="absolute w-[640px] h-[480px] border border-retroBorder bg-white shadow-lg animate-fadeInRetro"
      style={{ zIndex }}
      onMouseDown={onClick}
    >
      <div className="window-header bg-retroTitleBar text-retroTitleBarText p-2 cursor-move flex justify-between items-center">
        <span className="font-retro text-sm">{title}</span>
        <div className="flex space-x-1">
          <button
            className="w-4 h-4 bg-yellow-300 rounded-sm"
            onClick={onMinimize}
            title="Minimiser"
          />
          <button
            className="w-4 h-4 bg-red-500 rounded-sm"
            onClick={onClose}
            title="Fermer"
          />
        </div>
      </div>
      <iframe
        src={contentUrl}
        title={title}
        className="w-full h-[calc(100%-32px)]"
      />
    </div>
  );
}