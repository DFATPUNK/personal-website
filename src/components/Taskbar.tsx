export interface TaskbarProps {
  windows: { title: string }[];
  zIndexes: number[];
  onRestore: (index: number) => void;
}

export default function Taskbar({ windows, zIndexes, onRestore }: TaskbarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-10 bg-retroTaskbar border-t border-retroTaskbarBorder flex items-center px-2 space-x-2 z-[999]">
      {windows.map((win, index) => {
        const isMinimized = zIndexes[index] === -1;
        return (
          <button
            key={win.title}
            className={`px-3 py-1 border border-retroBorder rounded-sm font-retro text-xs ${
              isMinimized
                ? "bg-retroGray text-black"
                : "bg-retroAccent text-white"
            }`}
            onClick={() => onRestore(index)}
          >
            {win.title}
          </button>
        );
      })}
    </div>
  );
}